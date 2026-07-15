import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import "./global.css";
import styles from "./App.module.css";
import { Sidebar } from "./components/Sidebar";
import { Post } from "./components/Post";

function readStoredUser() {
  const storedUser = window.localStorage.getItem("authUser");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

export function App() {
  const [screen, setScreen] = useState(() => {
    const hasStoredToken = Boolean(window.localStorage.getItem("authToken"));
    return hasStoredToken ? "booting" : "auth";
  });
  const [authView, setAuthView] = useState("login");
  const [authToken, setAuthToken] = useState(() =>
    window.localStorage.getItem("authToken") ?? ""
  );
  const [authUser, setAuthUser] = useState(() => readStoredUser());
  const [authFormData, setAuthFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [tarefas, setTarefas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: false,
  });
  const [filters, setFilters] = useState({
    titulo: "",
    status: "all",
    data: "",
  });

  const isAuthenticated = Boolean(authToken && authUser);

  function getAuthHeaders(extraHeaders = {}) {
    return authToken
      ? {
          Authorization: `Bearer ${authToken}`,
          ...extraHeaders,
        }
      : extraHeaders;
  }

  function persistSession(data) {
    const nextToken = data.accessToken ?? "";
    const nextUser = data.user ?? null;

    setAuthToken(nextToken);
    setAuthUser(nextUser);
    window.localStorage.setItem("authToken", nextToken);
    window.localStorage.setItem("authUser", JSON.stringify(nextUser));
  }

  function clearSession({ keepAuthView = false } = {}) {
    setAuthToken("");
    setAuthUser(null);
    setTarefas([]);
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUser");
    setAuthSuccess("");
    setAuthError("");
    setError("");
    setIsLoading(false);
    setIsModalOpen(false);
    setEditingTaskId(null);
    setFormError("");
    setAuthFormData({
      name: "",
      email: "",
      password: "",
    });

    if (!keepAuthView) {
      setAuthView("login");
    }
  }

  useEffect(() => {
    async function bootstrapSession() {
      if (!authToken) {
        setScreen("auth");
        return;
      }

      try {
        const response = await fetch("/auth/me", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Sessão inválida");
        }

        const data = await response.json();

        if (data?.user) {
          setAuthUser(data.user);
          window.localStorage.setItem("authUser", JSON.stringify(data.user));
          setScreen("tasks");
          return;
        }

        throw new Error("Sessão inválida");
      } catch {
        clearSession({ keepAuthView: true });
        setScreen("auth");
      }
    }

    bootstrapSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadTarefas() {
      if (!isAuthenticated) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/tarefas", {
          headers: getAuthHeaders(),
        });

        if (response.status === 401) {
          clearSession({ keepAuthView: true });
          setScreen("auth");
          setAuthError("Sua sessão expirou. Faça login novamente.");
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao carregar tarefas");
        }

        const data = await response.json();
        setTarefas(Array.isArray(data) ? data : data.tarefas ?? []);
      } catch (err) {
        setTarefas([]);
        setError(err.message || "Erro inesperado ao buscar tarefas");
      } finally {
        setIsLoading(false);
      }
    }

    if (screen === "tasks" && isAuthenticated) {
      loadTarefas();
    }
  }, [authToken, isAuthenticated, screen]);

  function handleAuthFieldChange(event) {
    const { name, value } = event.target;

    setAuthFormData((state) => ({
      ...state,
      [name]: value,
    }));
  }

  async function handleSubmitAuth(event) {
    event.preventDefault();

    try {
      setIsAuthenticating(true);
      setAuthError("");
      setAuthSuccess("");

      const isRegister = authView === "register";
      const response = await fetch(
        isRegister ? "/auth/register" : "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isRegister
              ? {
                  name: authFormData.name.trim(),
                  email: authFormData.email.trim(),
                  password: authFormData.password,
                }
              : {
                  email: authFormData.email.trim(),
                  password: authFormData.password,
                }
          ),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (isRegister
              ? "Falha ao cadastrar usuário. Verifique os dados informados."
              : "Falha ao autenticar usuário. Verifique os dados informados.")
        );
      }

      persistSession(data);
      setScreen("tasks");
      setAuthSuccess(
        isRegister
          ? "Usuário cadastrado com sucesso."
          : "Login realizado com sucesso."
      );
      setAuthFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setAuthError(err.message || "Erro inesperado ao autenticar usuário");
    } finally {
      setIsAuthenticating(false);
    }
  }

  function handleLogout() {
    clearSession();
    setScreen("auth");
  }

  function openModal() {
    if (!isAuthenticated) {
      setAuthError("Faça login para criar uma tarefa.");
      setScreen("auth");
      return;
    }

    setFormError("");
    setEditingTaskId(null);
    setFormData({
      titulo: "",
      descricao: "",
      status: false,
    });
    setIsModalOpen(true);
  }

  function openEditModal(tarefa) {
    setFormError("");
    setEditingTaskId(tarefa.id);
    setFormData({
      titulo: tarefa.titulo ?? "",
      descricao: tarefa.descricao ?? "",
      status: Boolean(tarefa.status),
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setFormError("");
    setEditingTaskId(null);
  }

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((state) => ({
      ...state,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleCreateTask(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setFormError("");

      const isEditing = editingTaskId !== null;
      const response = await fetch(
        isEditing ? `/tarefas/${editingTaskId}` : "/tarefas",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: getAuthHeaders({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            titulo: formData.titulo.trim(),
            descricao: formData.descricao.trim(),
            status: formData.status,
          }),
        }
      );

      if (response.status === 401) {
        clearSession({ keepAuthView: true });
        setScreen("auth");
        setAuthError("Sua sessão expirou. Faça login novamente.");
        return;
      }

      if (!response.ok) {
        throw new Error(
          isEditing ? "Falha ao atualizar tarefa" : "Falha ao salvar tarefa"
        );
      }

      const createdTask = await response.json();

      setTarefas((current) =>
        isEditing
          ? current.map((tarefa) =>
              tarefa.id === editingTaskId ? createdTask : tarefa
            )
          : [createdTask, ...current]
      );
      setFormData({
        titulo: "",
        descricao: "",
        status: false,
      });
      setIsModalOpen(false);
    } catch (err) {
      setFormError(
        err.message ||
          (editingTaskId !== null
            ? "Erro inesperado ao atualizar tarefa"
            : "Erro inesperado ao salvar tarefa")
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTask(id) {
    const confirmed = window.confirm("Deseja excluir esta tarefa?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/tarefas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        clearSession({ keepAuthView: true });
        setScreen("auth");
        setAuthError("Sua sessão expirou. Faça login novamente.");
        return;
      }

      if (!response.ok) {
        throw new Error("Falha ao excluir tarefa");
      }

      setTarefas((current) => current.filter((tarefa) => tarefa.id !== id));
    } catch (err) {
      setError(err.message || "Erro inesperado ao excluir tarefa");
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((state) => ({
      ...state,
      [name]: value,
    }));
  }

  function matchesDateFilter(tarefaDate) {
    if (!filters.data) {
      return true;
    }

    const formattedDate = new Date(tarefaDate).toISOString().split("T")[0];
    return formattedDate === filters.data;
  }

  const filteredTarefas = tarefas.filter((tarefa) => {
    const titleMatch = tarefa.titulo
      ?.toLowerCase()
      .includes(filters.titulo.toLowerCase().trim());

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "done" && Boolean(tarefa.status)) ||
      (filters.status === "pending" && !Boolean(tarefa.status));

    const tarefaDate = tarefa.creatAtt ?? tarefa.createdAt ?? tarefa.data;

    return titleMatch && statusMatch && matchesDateFilter(tarefaDate);
  });

  const authTitle =
    authView === "register" ? "Criar conta" : "Entrar na sua conta";
  const authDescription =
    authView === "register"
      ? "Cadastre um usuário e receba acesso imediato às tarefas."
      : "Faça login para continuar no painel de tarefas.";

  if (screen === "booting") {
    return (
      <div className={styles.authShell}>
        <div className={styles.bootCard}>Validando sua sessão...</div>
      </div>
    );
  }

  if (screen === "auth") {
    return (
      <div className={styles.authShell}>
        <section className={styles.authCard}>
          <div className={styles.authBrand}>
            <Header />
          </div>

          <div className={styles.authPanelHeader}>
            <div>
              <strong>{authTitle}</strong>
              <span>{authDescription}</span>
            </div>
          </div>

          <div className={styles.authActions}>
            <button
              type="button"
              className={authView === "login" ? styles.activeTab : styles.tab}
              onClick={() => setAuthView("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={
                authView === "register" ? styles.activeTab : styles.tab
              }
              onClick={() => setAuthView("register")}
            >
              Cadastro
            </button>
          </div>

          <form className={styles.authForm} onSubmit={handleSubmitAuth}>
            {authView === "register" ? (
              <label>
                Nome
                <input
                  name="name"
                  value={authFormData.name}
                  onChange={handleAuthFieldChange}
                  placeholder="Seu nome"
                  required
                />
              </label>
            ) : null}

            <label>
              E-mail
              <input
                type="email"
                name="email"
                value={authFormData.email}
                onChange={handleAuthFieldChange}
                placeholder="voce@exemplo.com"
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                name="password"
                value={authFormData.password}
                onChange={handleAuthFieldChange}
                placeholder="Sua senha"
                required
              />
            </label>

            <button type="submit" disabled={isAuthenticating}>
              {isAuthenticating
                ? authView === "register"
                  ? "Cadastrando..."
                  : "Entrando..."
                : authView === "register"
                ? "Cadastrar usuário"
                : "Fazer login"}
            </button>
          </form>

          {authError ? <p className={styles.authError}>{authError}</p> : null}
          {authSuccess ? (
            <p className={styles.authSuccess}>{authSuccess}</p>
          ) : null}
        </section>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={styles.topBar}>
        <div>
          <strong>{authUser?.name}</strong>
          <span>{authUser?.email}</span>
        </div>
        <button type="button" className={styles.ghostButton} onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div className={styles.wrapper}>
        <Sidebar onCreateTask={openModal} />
        <main>
          <section className={styles.filters}>
            <div className={styles.filterField}>
              <label htmlFor="filter-title">Pesquisar por título</label>
              <input
                id="filter-title"
                name="titulo"
                value={filters.titulo}
                onChange={handleFilterChange}
                placeholder="Digite o título"
              />
            </div>

            <div className={styles.filterField}>
              <label htmlFor="filter-status">Status</label>
              <select
                id="filter-status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="done">Concluída</option>
              </select>
            </div>

            <div className={styles.filterField}>
              <label htmlFor="filter-date">Data</label>
              <input
                id="filter-date"
                type="date"
                name="data"
                value={filters.data}
                onChange={handleFilterChange}
              />
            </div>
          </section>

          {isLoading && <p>Carregando tarefas...</p>}
          {error && <p>{error}</p>}
          {!isLoading &&
            !error &&
            filteredTarefas.map((tarefa) => (
              <Post
                key={tarefa.id}
                tarefa={tarefa}
                onEdit={() => openEditModal(tarefa)}
                onDelete={() => handleDeleteTask(tarefa.id)}
              />
            ))}
          {!isLoading && !error && filteredTarefas.length === 0 && (
            <p>Nenhuma tarefa encontrada.</p>
          )}
        </main>
      </div>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tarefa-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <div>
                <strong id="tarefa-modal-title">
                  {editingTaskId !== null ? "Editar tarefa" : "Nova tarefa"}
                </strong>
                <span>
                  {editingTaskId !== null
                    ? "Atualize os dados da tarefa selecionada"
                    : "Cadastre uma tarefa usando o formulário abaixo"}
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className={styles.closeButton}
              >
                Fechar
              </button>
            </header>

            <form className={styles.modalForm} onSubmit={handleCreateTask}>
              <label>
                Título
                <input
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleFieldChange}
                  placeholder="Ex: Revisar backlog"
                  required
                />
              </label>

              <label>
                Descrição
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleFieldChange}
                  placeholder="Descreva a tarefa"
                  required
                />
              </label>

              <label className={styles.checkboxField}>
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleFieldChange}
                />
                Tarefa concluída
              </label>

              {formError && <p className={styles.modalError}>{formError}</p>}

              <footer className={styles.modalActions}>
                <button type="button" onClick={closeModal} disabled={isSaving}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving}>
                  {isSaving
                    ? "Salvando..."
                    : editingTaskId !== null
                    ? "Atualizar tarefa"
                    : "Salvar tarefa"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
