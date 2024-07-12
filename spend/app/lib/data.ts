import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  ExpenseForm,
  InvoicesTable,
  LatestInvoiceRaw,
  LatestExpenseRaw,
  ExpensesTable,
  ReasonTable,
  Revenue,
  user,
  ReasonField,
} from './definitions';
import { formatCurrency } from './utils';
import { User } from 'next-auth';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchProfileTemp() {
  try {
    const data = await sql<user>`
      SELECT id, name, email, image_url
      FROM users
      `;

    const profileTemp = data.rows.map((profile) => ({ ...profile }));

    return profileTemp;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

// Fetch Expenses

const EXPENSE_PER_PAGE = 6;
export async function fetchFilteredExpenses(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * EXPENSE_PER_PAGE;

  try {
    const expenses = await sql<ExpensesTable>`
      SELECT
        expenses.id,
        expenses.reason,
        expenses.amount,
        expenses.issued_to,
        expenses.date
      FROM expenses
      WHERE
        expenses.reason ILIKE ${`%${query}%`} OR
        expenses.amount::text ILIKE ${`%${query}%`} OR
        expenses.date::text ILIKE ${`%${query}%`} OR
        expenses.issued_to ILIKE ${`%${query}%`}
      ORDER BY expenses.date DESC
      LIMIT ${EXPENSE_PER_PAGE} OFFSET ${offset}
    `;

    return expenses.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense record.');
  }
}

export async function fetchExpensesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM expenses
    WHERE
      expenses.reason ILIKE ${`%${query}%`} OR
      expenses.amount::text ILIKE ${`%${query}%`} OR
      expenses.issued_to ILIKE ${`%${query}%`} OR
      expenses.date::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / EXPENSE_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of expenses.');
  }
}

export async function fetchExpensesById(id: string) {
  try {
    const data = await sql<ExpenseForm>`
      SELECT
        expenses.id,
        expenses.reason,
        expenses.amount,
        expenses.issued_to,
        expenses.date
      FROM expenses
      WHERE expenses.id = ${id};
    `;

    const expense = data.rows.map((expense) => ({
      ...expense,
      // Convert amount from cents to dollars
      // amount: expense.amount / 100,
    }));

    return expense[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense.');
  }
}

export async function fetchReason() {
  try {
    const data = await sql<ReasonField>`
      SELECT
        id,
        reason
      FROM reason
      ORDER BY reason ASC
    `;

    const reason = data.rows;
    return reason;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all reasons.');
  }
}

export async function fetchLatestExpenses() {
  try {
    const data = await sql<LatestExpenseRaw>`
      SELECT expenses.id, expenses.reason, expenses.amount, expenses.issued_to, expenses.date
      FROM expenses
      ORDER BY expenses.date DESC
      LIMIT 5`;

    const latestExpenses = data.rows.map((expense) => ({
      ...expense,
      amount: formatCurrency(expense.amount),
    }));
    return latestExpenses;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest expenses.');
  }
}

// Fetch Reason

const REASON_PER_PAGE = 6;
export async function fetchFilteredReason(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * REASON_PER_PAGE;

  try {
    const reason = await sql<ReasonTable>`
      SELECT *
      FROM reason
      WHERE
        reason.reason ILIKE ${`%${query}%`}
      ORDER BY reason.date DESC
      LIMIT ${REASON_PER_PAGE} OFFSET ${offset}
    `;

    return reason.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reason record.');
  }
}

export async function fetchReasonPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM reason
    WHERE
      reason.reason ILIKE ${`%${query}%`} OR
      reason.date::text ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / REASON_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of reasons.');
  }
}

export async function fetchReasonsById(id: string) {
  try {
    const data = await sql<ExpenseForm>`
      SELECT *
      FROM reason
      WHERE reason.id = ${id};
    `;

    const reason = data.rows.map((reason) => ({
      ...reason,
      // Convert amount from cents to dollars
      // amount: expense.amount / 100,
    }));

    return reason[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reason.');
  }
}

export async function fetchCardDataTemp() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const expensesCountPromise = sql`SELECT COUNT(*) FROM expenses`;
    const reasonsCountPromise = sql`SELECT COUNT(*) FROM reason`;
    const totalExpenses = sql`SELECT SUM(amount) FROM expenses`;

    const data = await Promise.all([
      expensesCountPromise,
      reasonsCountPromise,
      totalExpenses,
    ]);

    const numberOfExpenses = Number(data[0].rows[0].count ?? '0');
    const numberOfReasons = Number(data[1].rows[0].count ?? '0');
    const totalExpensesAmount = formatCurrency(data[2].rows[0].sum ?? '0');

    return {
      numberOfReasons,
      numberOfExpenses,
      totalExpensesAmount,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}