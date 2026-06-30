"use client";

import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeDollarSign,
  Banknote,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  WalletCards
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type TransactionType = "income" | "expense";
type AccountType = "checking" | "savings" | "investment";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  kind: "person" | "company";
}

interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isSystem: boolean;
}

interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  category: Category | null;
  transferId?: string;
  cardId?: string;
}

interface Card {
  id: string;
  name: string;
  limit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
}

interface Summary {
  totalBalance: number;
  income: number;
  expense: number;
  net: number;
  accounts: number;
  transactions: number;
  byCategory: Array<{ categoryId: string; categoryName: string; type: TransactionType; total: number }>;
}

interface Cashflow {
  period: string;
  income: number;
  expense: number;
  net: number;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const today = new Date().toISOString().slice(0, 10);

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message ?? "A requisicao falhou");
  }
  return body as T;
}

export function FinanceApp() {
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [session, setSession] = useState<Session | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cashflow, setCashflow] = useState<Cashflow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [authForm, setAuthForm] = useState({ name: "Pedro Luiz", email: "pedro@contacomigo.local", password: "123456", kind: "person" });
  const [accountForm, setAccountForm] = useState({ name: "Conta Principal", type: "checking" as AccountType });
  const [categoryForm, setCategoryForm] = useState({ name: "Clientes", type: "income" as TransactionType });
  const [transactionForm, setTransactionForm] = useState({
    accountId: "",
    type: "income" as TransactionType,
    amount: "2500",
    categoryId: "",
    description: "Recebimento",
    date: today
  });
  const [transferForm, setTransferForm] = useState({ fromAccountId: "", toAccountId: "", amount: "100", description: "Reserva", date: today });
  const [cardForm, setCardForm] = useState({ name: "Cartao Empresas", limit: "5000", closingDay: "20", dueDay: "10" });
  const [cardTransactionForm, setCardTransactionForm] = useState({
    cardId: "",
    accountId: "",
    amount: "300",
    description: "Software",
    installmentCount: "1",
    categoryId: "",
    date: today
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("conta-comigo-session");
    if (stored) {
      const nextSession = JSON.parse(stored) as Session;
      setSession(nextSession);
      void loadData(nextSession.accessToken);
    }
  }, []);

  useEffect(() => {
    if (!accounts[0]) {
      return;
    }
    setTransactionForm((current) => ({ ...current, accountId: current.accountId || accounts[0].id }));
    setTransferForm((current) => ({
      ...current,
      fromAccountId: current.fromAccountId || accounts[0].id,
      toAccountId: current.toAccountId || accounts[1]?.id || accounts[0].id
    }));
    setCardTransactionForm((current) => ({ ...current, accountId: current.accountId || accounts[0].id }));
  }, [accounts]);

  useEffect(() => {
    const income = categories.find((category) => category.type === "income");
    const expense = categories.find((category) => category.type === "expense");
    setTransactionForm((current) => ({ ...current, categoryId: current.categoryId || (current.type === "income" ? income?.id ?? "" : expense?.id ?? "") }));
    setCardTransactionForm((current) => ({ ...current, categoryId: current.categoryId || expense?.id || "" }));
  }, [categories]);

  useEffect(() => {
    setCardTransactionForm((current) => ({ ...current, cardId: current.cardId || cards[0]?.id || "" }));
  }, [cards]);

  const incomeCategories = useMemo(() => categories.filter((category) => category.type === "income"), [categories]);
  const expenseCategories = useMemo(() => categories.filter((category) => category.type === "expense"), [categories]);
  const transactionCategories = transactionForm.type === "income" ? incomeCategories : expenseCategories;

  async function api<T>(path: string, options: RequestInit = {}, token = session?.accessToken) {
    return parseResponse<T>(
      await fetch(`${apiBase}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        }
      })
    );
  }

  async function loadData(token = session?.accessToken) {
    if (!token) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const [nextAccounts, nextCategories, nextTransactions, nextCards, nextSummary, nextCashflow] = await Promise.all([
        api<Account[]>("/accounts", {}, token),
        api<Category[]>("/categories", {}, token),
        api<Transaction[]>("/transactions", {}, token),
        api<Card[]>("/cards", {}, token),
        api<Summary>("/reports/summary", {}, token),
        api<Cashflow[]>("/reports/cashflow", {}, token)
      ]);
      setAccounts(nextAccounts);
      setCategories(nextCategories);
      setTransactions(nextTransactions);
      setCards(nextCards);
      setSummary(nextSummary);
      setCashflow(nextCashflow);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel carregar os dados");
    } finally {
      setBusy(false);
    }
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const path = authMode === "register" ? "/auth/register" : "/auth/login";
      const body = authMode === "register" ? authForm : { email: authForm.email, password: authForm.password };
      const nextSession = await api<Session>(path, { method: "POST", body: JSON.stringify(body) }, undefined);
      setSession(nextSession);
      window.localStorage.setItem("conta-comigo-session", JSON.stringify(nextSession));
      setNotice(authMode === "register" ? "Usuario criado e conectado." : "Sessao iniciada.");
      await loadData(nextSession.accessToken);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel autenticar");
    } finally {
      setBusy(false);
    }
  }

  async function mutate<T>(path: string, payload: Record<string, unknown>, success: string, method = "POST") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api<T>(path, { method, body: JSON.stringify(payload) });
      setNotice(success);
      await loadData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Operacao nao concluida");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("conta-comigo-session");
    setSession(null);
    setAccounts([]);
    setCategories([]);
    setTransactions([]);
    setCards([]);
    setSummary(null);
    setCashflow([]);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <BadgeDollarSign size={22} />
          </div>
          <div>
            <h1>Conta Comigo</h1>
            <p>{session ? session.user.email : "Sistema financeiro inteligente"}</p>
          </div>
        </div>
        {session ? (
          <div className="brand">
            <button className="secondary" onClick={() => loadData()} disabled={busy} title="Atualizar dados">
              <RefreshCw size={17} /> Atualizar
            </button>
            <button className="ghost" onClick={logout} title="Sair">
              <LogOut size={17} /> Sair
            </button>
          </div>
        ) : null}
      </header>

      {!session ? (
        <section className="content auth-layout">
          <div className="hero-panel">
            <div className="hero-content">
              <h2>Controle financeiro claro, modular e pronto para crescer.</h2>
              <p>Receitas, despesas, contas, cartoes, transferencias e relatorios em uma base alinhada a arquitetura do projeto.</p>
            </div>
          </div>

          <form className="auth-card" onSubmit={submitAuth}>
            <div className="tabs" role="tablist">
              <button type="button" className={`tab ${authMode === "register" ? "active" : ""}`} onClick={() => setAuthMode("register")}>
                Cadastro
              </button>
              <button type="button" className={`tab ${authMode === "login" ? "active" : ""}`} onClick={() => setAuthMode("login")}>
                Login
              </button>
            </div>

            {authMode === "register" ? (
              <label>
                Nome
                <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} />
              </label>
            ) : null}

            <label>
              E-mail
              <input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} />
            </label>

            <label>
              Senha
              <input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} />
            </label>

            {authMode === "register" ? (
              <label>
                Perfil
                <select value={authForm.kind} onChange={(event) => setAuthForm({ ...authForm, kind: event.target.value })}>
                  <option value="person">Pessoa fisica</option>
                  <option value="company">Pessoa juridica</option>
                </select>
              </label>
            ) : null}

            {error ? <div className="error">{error}</div> : null}
            {notice ? <div className="success">{notice}</div> : null}

            <button className="primary" disabled={busy}>
              <Plus size={17} /> {authMode === "register" ? "Criar conta" : "Entrar"}
            </button>
          </form>
        </section>
      ) : (
        <section className="content">
          <div className="section-title">
            <div>
              <h2>Dashboard financeiro</h2>
              <p>{session.user.name} - {summary?.transactions ?? 0} movimentacoes registradas</p>
            </div>
          </div>

          {error ? <div className="error">{error}</div> : null}
          {notice ? <div className="success">{notice}</div> : null}

          <section className="metrics-grid">
            <Metric icon={<WalletCards size={20} />} label="Saldo total" value={currency.format(summary?.totalBalance ?? 0)} />
            <Metric icon={<ArrowUpRight size={20} />} label="Receitas" value={currency.format(summary?.income ?? 0)} />
            <Metric icon={<ArrowDownRight size={20} />} label="Despesas" value={currency.format(summary?.expense ?? 0)} />
            <Metric icon={<LayoutDashboard size={20} />} label="Resultado" value={currency.format(summary?.net ?? 0)} />
          </section>

          <section className="grid-3">
            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                void mutate<Account>("/accounts", accountForm, "Conta criada.");
              }}
            >
              <PanelTitle icon={<Banknote size={18} />} title="Contas" />
              <label>
                Nome
                <input value={accountForm.name} onChange={(event) => setAccountForm({ ...accountForm, name: event.target.value })} />
              </label>
              <label>
                Tipo
                <select value={accountForm.type} onChange={(event) => setAccountForm({ ...accountForm, type: event.target.value as AccountType })}>
                  <option value="checking">Corrente</option>
                  <option value="savings">Poupanca</option>
                  <option value="investment">Investimento</option>
                </select>
              </label>
              <button className="primary" disabled={busy}>
                <Plus size={17} /> Criar conta
              </button>
              <div className="account-list">
                {accounts.map((account) => (
                  <div className="list-item" key={account.id}>
                    <div>
                      <strong>{account.name}</strong>
                      <div className="muted">{account.type}</div>
                    </div>
                    <strong>{currency.format(account.balance)}</strong>
                  </div>
                ))}
              </div>
            </form>

            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                void mutate<Category>("/categories", categoryForm, "Categoria criada.");
              }}
            >
              <PanelTitle icon={<LayoutDashboard size={18} />} title="Categorias" />
              <label>
                Nome
                <input value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
              </label>
              <label>
                Tipo
                <select value={categoryForm.type} onChange={(event) => setCategoryForm({ ...categoryForm, type: event.target.value as TransactionType })}>
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </label>
              <button className="primary" disabled={busy}>
                <Plus size={17} /> Criar categoria
              </button>
              <div className="category-list">
                {categories.slice(0, 5).map((category) => (
                  <div className="list-item" key={category.id}>
                    <span>{category.name}</span>
                    <span className="badge">{category.type}</span>
                  </div>
                ))}
              </div>
            </form>

            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                void mutate<Card>(
                  "/cards",
                  {
                    ...cardForm,
                    limit: Number(cardForm.limit),
                    closingDay: Number(cardForm.closingDay),
                    dueDay: Number(cardForm.dueDay)
                  },
                  "Cartao criado."
                );
              }}
            >
              <PanelTitle icon={<CreditCard size={18} />} title="Cartoes" />
              <label>
                Nome
                <input value={cardForm.name} onChange={(event) => setCardForm({ ...cardForm, name: event.target.value })} />
              </label>
              <div className="form-row">
                <label>
                  Limite
                  <input type="number" min="0" step="0.01" value={cardForm.limit} onChange={(event) => setCardForm({ ...cardForm, limit: event.target.value })} />
                </label>
                <label>
                  Vencimento
                  <input type="number" min="1" max="31" value={cardForm.dueDay} onChange={(event) => setCardForm({ ...cardForm, dueDay: event.target.value })} />
                </label>
              </div>
              <label>
                Fechamento
                <input type="number" min="1" max="31" value={cardForm.closingDay} onChange={(event) => setCardForm({ ...cardForm, closingDay: event.target.value })} />
              </label>
              <button className="primary" disabled={busy}>
                <Plus size={17} /> Criar cartao
              </button>
              <div className="card-list">
                {cards.map((card) => (
                  <div className="list-item" key={card.id}>
                    <div>
                      <strong>{card.name}</strong>
                      <div className="muted">Dia {card.dueDay}</div>
                    </div>
                    <strong>{currency.format(card.availableLimit)}</strong>
                  </div>
                ))}
              </div>
            </form>
          </section>

          <section className="grid-2">
            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                void mutate<Transaction>(
                  "/transactions",
                  { ...transactionForm, amount: Number(transactionForm.amount) },
                  "Transacao criada."
                );
              }}
            >
              <PanelTitle icon={<ArrowUpRight size={18} />} title="Transacao" />
              <div className="form-row">
                <label>
                  Conta
                  <select value={transactionForm.accountId} onChange={(event) => setTransactionForm({ ...transactionForm, accountId: event.target.value })}>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Tipo
                  <select
                    value={transactionForm.type}
                    onChange={(event) => {
                      const type = event.target.value as TransactionType;
                      const nextCategory = (type === "income" ? incomeCategories : expenseCategories)[0]?.id ?? "";
                      setTransactionForm({ ...transactionForm, type, categoryId: nextCategory });
                    }}
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Valor
                  <input type="number" min="0" step="0.01" value={transactionForm.amount} onChange={(event) => setTransactionForm({ ...transactionForm, amount: event.target.value })} />
                </label>
                <label>
                  Data
                  <input type="date" value={transactionForm.date} onChange={(event) => setTransactionForm({ ...transactionForm, date: event.target.value })} />
                </label>
              </div>
              <label>
                Categoria
                <select value={transactionForm.categoryId} onChange={(event) => setTransactionForm({ ...transactionForm, categoryId: event.target.value })}>
                  {transactionCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Descricao
                <input value={transactionForm.description} onChange={(event) => setTransactionForm({ ...transactionForm, description: event.target.value })} />
              </label>
              <button className="primary" disabled={busy || !accounts.length || !transactionCategories.length}>
                <Plus size={17} /> Registrar
              </button>
            </form>

            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                void mutate(
                  "/transfers",
                  { ...transferForm, amount: Number(transferForm.amount) },
                  "Transferencia concluida."
                );
              }}
            >
              <PanelTitle icon={<ArrowLeftRight size={18} />} title="Transferencia" />
              <div className="form-row">
                <label>
                  Origem
                  <select value={transferForm.fromAccountId} onChange={(event) => setTransferForm({ ...transferForm, fromAccountId: event.target.value })}>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Destino
                  <select value={transferForm.toAccountId} onChange={(event) => setTransferForm({ ...transferForm, toAccountId: event.target.value })}>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Valor
                  <input type="number" min="0" step="0.01" value={transferForm.amount} onChange={(event) => setTransferForm({ ...transferForm, amount: event.target.value })} />
                </label>
                <label>
                  Data
                  <input type="date" value={transferForm.date} onChange={(event) => setTransferForm({ ...transferForm, date: event.target.value })} />
                </label>
              </div>
              <label>
                Descricao
                <input value={transferForm.description} onChange={(event) => setTransferForm({ ...transferForm, description: event.target.value })} />
              </label>
              <button className="primary" disabled={busy || accounts.length < 2}>
                <ArrowLeftRight size={17} /> Transferir
              </button>
            </form>
          </section>

          <section className="grid-2">
            <form
              className="panel"
              onSubmit={(event) => {
                event.preventDefault();
                void mutate(
                  "/cards/transactions",
                  {
                    ...cardTransactionForm,
                    amount: Number(cardTransactionForm.amount),
                    installmentCount: Number(cardTransactionForm.installmentCount)
                  },
                  "Compra registrada."
                );
              }}
            >
              <PanelTitle icon={<CreditCard size={18} />} title="Compra no cartao" />
              <div className="form-row">
                <label>
                  Cartao
                  <select value={cardTransactionForm.cardId} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, cardId: event.target.value })}>
                    {cards.map((card) => (
                      <option key={card.id} value={card.id}>{card.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Conta
                  <select value={cardTransactionForm.accountId} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, accountId: event.target.value })}>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Valor
                  <input type="number" min="0" step="0.01" value={cardTransactionForm.amount} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, amount: event.target.value })} />
                </label>
                <label>
                  Parcelas
                  <input type="number" min="1" max="48" value={cardTransactionForm.installmentCount} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, installmentCount: event.target.value })} />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Categoria
                  <select value={cardTransactionForm.categoryId} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, categoryId: event.target.value })}>
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Data
                  <input type="date" value={cardTransactionForm.date} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, date: event.target.value })} />
                </label>
              </div>
              <label>
                Descricao
                <input value={cardTransactionForm.description} onChange={(event) => setCardTransactionForm({ ...cardTransactionForm, description: event.target.value })} />
              </label>
              <button className="primary" disabled={busy || !cards.length || !accounts.length}>
                <Plus size={17} /> Registrar compra
              </button>
            </form>

            <section className="panel">
              <PanelTitle icon={<LayoutDashboard size={18} />} title="Fluxo de caixa" />
              <div className="cashflow-list">
                {cashflow.length ? (
                  cashflow.map((item) => (
                    <div className="list-item" key={item.period}>
                      <strong>{item.period}</strong>
                      <span className={item.net >= 0 ? "amount-income" : "amount-expense"}>{currency.format(item.net)}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty">Sem movimentacoes no periodo.</div>
                )}
              </div>
              <div className="cashflow-list">
                {summary?.byCategory.slice(0, 5).map((item) => (
                  <div className="list-item" key={`${item.type}-${item.categoryId}`}>
                    <span>{item.categoryName}</span>
                    <strong>{currency.format(item.total)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <section className="panel">
            <PanelTitle icon={<LayoutDashboard size={18} />} title="Movimentacoes" />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descricao</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString("pt-BR")}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.category?.name ?? "Sem categoria"}</td>
                      <td>{transaction.type === "income" ? "Receita" : "Despesa"}</td>
                      <td className={transaction.type === "income" ? "amount-income" : "amount-expense"}>{currency.format(transaction.amount)}</td>
                      <td>
                        <button
                          className="danger"
                          disabled={busy || Boolean(transaction.transferId)}
                          title="Excluir transacao"
                          onClick={() => void mutate(`/transactions/${transaction.id}`, {}, "Transacao removida.", "DELETE")}
                        >
                          <Trash2 size={16} /> Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{label}</span>
        {icon}
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="panel-header">
      <h3>{title}</h3>
      {icon}
    </div>
  );
}
