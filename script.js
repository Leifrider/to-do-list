// CONFIGURAÇÃO DO SUPABASE
// Substitua pelas suas credenciais reais do projeto do Supabase (Chave pública 'anon')
const SUPABASE_URL = 'https://yikmhtooqdclkhaeghjo.supabase.co';
const SUPABASE_ANON_KEY = 'Ssb_publishable_rkp1sGkJXDnsamG6hDcoNw_3DL5mB41';

// Inicializa o cliente do Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Seleção de elementos do DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const errorMessage = document.getElementById('error-message');

// Função auxiliar para exibir erros na tela
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Função auxiliar para limpar mensagens de erro
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

// 1. Ler tarefas do banco na inicialização
async function fetchTasks() {
    clearError();
    try {
        const { data, error } = await supabaseClient
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderTasks(data);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error.message);
        showError('Não foi possível carregar as tarefas. Tente recarregar a página.');
    }
}

// Renderizar lista de tarefas na tela
function renderTasks(tasks) {
    taskList.innerHTML = '';
    if (!tasks) return;

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        taskList.appendChild(li);
    });
}

// 2. Adicionar nova tarefa
async function handleAddTask(event) {
    event.preventDefault();
    clearError();

    const text = taskInput.value.trim();

    // Validação: campo vazio ou só com espaços não gera tarefa
    if (!text) {
        showError('A tarefa não pode estar vazia.');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('tasks')
            .insert([{ text }]);

        if (error) throw error;

        taskInput.value = '';
        await fetchTasks(); // Recarrega a lista atualizada
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error.message);
        showError('Não foi possível salvar a tarefa. Tente novamente.');
    }
}

// Event Listeners
taskForm.addEventListener('submit', handleAddTask);

// Executar leitura ao carregar a página
window.addEventListener('DOMContentLoaded', fetchTasks);