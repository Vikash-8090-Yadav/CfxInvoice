// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InvoiceSystem
 * @dev On-chain invoice management system for freelancers
 */
contract InvoiceSystem {
    // Invoice status enum
    enum InvoiceStatus {
        Pending,
        Paid,
        Overdue,
        Cancelled
    }

    // Invoice structure
    struct Invoice {
        uint256 invoiceId;
        address freelancer;
        address client;
        uint256 amount;
        uint256 dueDate;
        InvoiceStatus status;
        string description;
        bool exists;
        uint256 createdAt;
        uint256 paidAt;
    }

    // Events
    event InvoiceCreated(
        uint256 indexed invoiceId,
        address indexed freelancer,
        address indexed client,
        uint256 amount,
        uint256 dueDate
    );
    
    event InvoicePaid(
        uint256 indexed invoiceId,
        address indexed client,
        uint256 amount,
        uint256 paidAt
    );
    
    event InvoiceStatusUpdated(
        uint256 indexed invoiceId,
        InvoiceStatus oldStatus,
        InvoiceStatus newStatus
    );
    
    event InvoiceCancelled(uint256 indexed invoiceId);

    // State variables
    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) public freelancerInvoices;
    mapping(address => uint256[]) public clientInvoices;
    uint256 public nextInvoiceId;
    address public owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier invoiceExists(uint256 _invoiceId) {
        require(invoices[_invoiceId].exists, "Invoice does not exist");
        _;
    }

    modifier onlyFreelancer(uint256 _invoiceId) {
        require(
            invoices[_invoiceId].freelancer == msg.sender,
            "Only the freelancer can perform this action"
        );
        _;
    }

    modifier onlyClient(uint256 _invoiceId) {
        require(
            invoices[_invoiceId].client == msg.sender,
            "Only the client can perform this action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        nextInvoiceId = 1;
    }

    /**
     * @dev Create a new invoice
     * @param _client Address of the client
     * @param _amount Amount to be paid (in wei)
     * @param _dueDate Unix timestamp of the due date
     * @param _description Description of the invoice
     * @return invoiceId The ID of the created invoice
     */
    function createInvoice(
        address _client,
        uint256 _amount,
        uint256 _dueDate,
        string memory _description
    ) external returns (uint256) {
        require(_client != address(0), "Invalid client address");
        require(_client != msg.sender, "Cannot create invoice for yourself");
        require(_amount > 0, "Amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");

        uint256 invoiceId = nextInvoiceId;
        nextInvoiceId++;

        Invoice memory newInvoice = Invoice({
            invoiceId: invoiceId,
            freelancer: msg.sender,
            client: _client,
            amount: _amount,
            dueDate: _dueDate,
            status: InvoiceStatus.Pending,
            description: _description,
            exists: true,
            createdAt: block.timestamp,
            paidAt: 0
        });

        invoices[invoiceId] = newInvoice;
        freelancerInvoices[msg.sender].push(invoiceId);
        clientInvoices[_client].push(invoiceId);

        emit InvoiceCreated(invoiceId, msg.sender, _client, _amount, _dueDate);

        return invoiceId;
    }

    /**
     * @dev Pay an invoice
     * @param _invoiceId ID of the invoice to pay
     */
    function payInvoice(uint256 _invoiceId)
        external
        payable
        invoiceExists(_invoiceId)
        onlyClient(_invoiceId)
    {
        Invoice storage invoice = invoices[_invoiceId];
        
        require(
            invoice.status == InvoiceStatus.Pending ||
            invoice.status == InvoiceStatus.Overdue,
            "Invoice is not payable"
        );
        require(msg.value >= invoice.amount, "Insufficient payment amount");

        InvoiceStatus oldStatus = invoice.status;
        invoice.status = InvoiceStatus.Paid;
        invoice.paidAt = block.timestamp;

        // Transfer payment to freelancer
        (bool success, ) = invoice.freelancer.call{value: invoice.amount}("");
        require(success, "Payment transfer failed");

        // Refund excess payment if any
        if (msg.value > invoice.amount) {
            (bool refundSuccess, ) = msg.sender.call{
                value: msg.value - invoice.amount
            }("");
            require(refundSuccess, "Refund failed");
        }

        emit InvoicePaid(_invoiceId, msg.sender, invoice.amount, block.timestamp);
        emit InvoiceStatusUpdated(_invoiceId, oldStatus, InvoiceStatus.Paid);
    }

    /**
     * @dev Mark an invoice as overdue (can be called by anyone)
     * @param _invoiceId ID of the invoice
     */
    function markAsOverdue(uint256 _invoiceId)
        external
        invoiceExists(_invoiceId)
    {
        Invoice storage invoice = invoices[_invoiceId];
        
        require(
            invoice.status == InvoiceStatus.Pending,
            "Invoice is not pending"
        );
        require(
            block.timestamp > invoice.dueDate,
            "Invoice is not yet overdue"
        );

        InvoiceStatus oldStatus = invoice.status;
        invoice.status = InvoiceStatus.Overdue;

        emit InvoiceStatusUpdated(_invoiceId, oldStatus, InvoiceStatus.Overdue);
    }

    /**
     * @dev Cancel an invoice (only freelancer can cancel)
     * @param _invoiceId ID of the invoice to cancel
     */
    function cancelInvoice(uint256 _invoiceId)
        external
        invoiceExists(_invoiceId)
        onlyFreelancer(_invoiceId)
    {
        Invoice storage invoice = invoices[_invoiceId];
        
        require(
            invoice.status == InvoiceStatus.Pending ||
            invoice.status == InvoiceStatus.Overdue,
            "Invoice cannot be cancelled"
        );

        InvoiceStatus oldStatus = invoice.status;
        invoice.status = InvoiceStatus.Cancelled;

        emit InvoiceCancelled(_invoiceId);
        emit InvoiceStatusUpdated(_invoiceId, oldStatus, InvoiceStatus.Cancelled);
    }

    /**
     * @dev Get invoice details
     * @param _invoiceId ID of the invoice
     * @return Invoice struct
     */
    function getInvoice(uint256 _invoiceId)
        external
        view
        invoiceExists(_invoiceId)
        returns (Invoice memory)
    {
        return invoices[_invoiceId];
    }

    /**
     * @dev Get all invoice IDs for a freelancer
     * @param _freelancer Address of the freelancer
     * @return Array of invoice IDs
     */
    function getFreelancerInvoices(address _freelancer)
        external
        view
        returns (uint256[] memory)
    {
        return freelancerInvoices[_freelancer];
    }

    /**
     * @dev Get all invoice IDs for a client
     * @param _client Address of the client
     * @return Array of invoice IDs
     */
    function getClientInvoices(address _client)
        external
        view
        returns (uint256[] memory)
    {
        return clientInvoices[_client];
    }

    /**
     * @dev Get total number of invoices
     * @return Total count
     */
    function getTotalInvoices() external view returns (uint256) {
        return nextInvoiceId - 1;
    }

    /**
     * @dev Check if an invoice is overdue
     * @param _invoiceId ID of the invoice
     * @return bool True if overdue
     */
    function isOverdue(uint256 _invoiceId)
        external
        view
        invoiceExists(_invoiceId)
        returns (bool)
    {
        Invoice memory invoice = invoices[_invoiceId];
        return (
            invoice.status == InvoiceStatus.Pending &&
            block.timestamp > invoice.dueDate
        );
    }
}

