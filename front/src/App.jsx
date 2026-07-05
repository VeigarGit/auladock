import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import "./global.css";
import styles from "./App.module.css";
import { Sidebar } from "./components/Sidebar";
import { Post } from "./components/Post";

export function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    async function loadTarefas() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/tarefas");
        if (!response.ok) {
          throw new Error("Falha ao carregar tarefas");
        }

        const data = await response.json();
        setTarefas(Array.isArray(data) ? data : data.tarefas ?? []);
      } catch (err) {
        setError(err.message || "Erro inesperado ao buscar tarefas");
      } finally {
        setIsLoading(false);
      }
    }

    loadTarefas();
  }, []);

  function openModal() {
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: formData.titulo.trim(),
            descricao: formData.descricao.trim(),
            status: formData.status,
          }),
        }
      );

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
      });

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

  return (
    <div>
      <Header />
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
              <button type="button" onClick={closeModal} className={styles.closeButton}>
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
