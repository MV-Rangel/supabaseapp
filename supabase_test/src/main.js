import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cqidqrqcwnptczzmhdwi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaWRxcnFjd25wdGN6em1oZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTA4MjksImV4cCI6MjA0OTUyNjgyOX0.ahANrBL_lrvMdXWVLMhP_h-1GvUzOwzZay7x3zP2wFI";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
  const main_form = document.querySelector("#meuForm");
  const student_name = document.querySelector("#floatingNameGrid");
  const cancelarBtn = document.querySelector(".cancel_button");
  const table_body = document.querySelector(".table_body");

  main_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const registration = {
      userName: student_name.value,
    };
try{
    if (registration.userName) {
        const { data, error } = await supabase
          .from("user")
          .insert([{ user_name: `${registration.userName}` }])
          .select();
      }
}catch(error){
    console.log("Não consegui ")
}
   

    main_form.reset();
    console.log();
  });

  cancelarBtn.addEventListener("click", () => {
    main_form.reset();
    console.log("resetado");
  });
});
