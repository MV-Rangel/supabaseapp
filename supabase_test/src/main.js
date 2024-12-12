import { supabase } from "./utils/supabase";

// Função para carregar dados iniciais
async function carregarDadosIniciais() {
    const { data, error } = await supabase
        .from('user')
        .select()
    
    if (error) {
        console.error('Erro ao buscar:', error)
        return
    }
    
    if (data) {
        show_registrations.innerText += data.map(user => user.user_name).join('\n')
    }
}

// Carregar dados quando a página iniciar
document.addEventListener('DOMContentLoaded', carregarDadosIniciais);

async function inserirUsuario(name) {
  if (!name.trim()) return null;

  const { data, error } = await supabase
    .from("user")
    .insert([{ user_name: name }])
    .select(); // Adicione esta linha para retornar os dados inseridos

  if (error) {
    console.error("Erro ao inserir:", error);
    return null;
  }

  // Verifica se data existe e tem elementos antes de acessar o índice 0
  if (data && data.length > 0) {
    return data[0];
  }
  return null;
}

async function buscarUsuarios() {
  const { data, error } = await supabase.from("user").select("*");

  if (error) console.error("Erro ao buscar:", error);
  else console.log("Usuários:", data);
}

async function deletarUsuario(id) {
  const { error } = await supabase.from("user").delete().eq("id", id);

  if (error) console.error("Erro ao deletar:", error);
  else console.log("Usuário deletado");
}
const register_name = document.querySelector("#register_name");
const show_registrations = document.querySelector(".show_registrations");
const main_form = document.querySelector(".main_form");

if (main_form) {
  main_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const resultado = await inserirUsuario(register_name.value);
    if (resultado && resultado.user_name) {
      show_registrations.innerText += resultado.user_name + "\n";
      main_form.reset();
      console.log(resultado.user_name);
    }
  });
}
document.querySelector("#buscar").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await buscarUsuarios();
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});
document.querySelector("#deletar").addEventListener("click", (e) => {
  e.preventDefault();
  const id = prompt("Digite o ID do usuário para deletar:");
  if (id) deletarUsuario(id);
});
