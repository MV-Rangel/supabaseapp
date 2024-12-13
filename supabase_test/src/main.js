import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cqidqrqcwnptczzmhdwi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaWRxcnFjd25wdGN6em1oZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTA4MjksImV4cCI6MjA0OTUyNjgyOX0.ahANrBL_lrvMdXWVLMhP_h-1GvUzOwzZay7x3zP2wFI";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
  const main_form = document.querySelector("#meuForm");
  const student_name = document.querySelector("#floatingNameGrid");
  const cancelarBtn = document.querySelector(".cancel_button");
  const floatingRoomNumberGrid = document.querySelector(
    "#floatingRoomNumberGrid"
  );
  const floatingResgisterGrid = document.querySelector(
    "#floatingResgisterGrid"
  );
  const floatingSelectTimeGrid = document.querySelector(
    "#floatingSelectTimeGrid"
  );
  const floatingDateGrid = document.querySelector("#floatingDateGrid");
  const table_body = document.querySelector(".table_body");

  const getUsers = async () => {
    let { data: user, error } = await supabase.from("user").select("*");

    for (let i = 0; i < user.length; i++) {
      let time_to_begin = 5;
      const timer = () => {
        const time_to_start = document.querySelectorAll(".time_to_start");
        time_to_start[i].innerText = time_to_begin--;
        time_to_begin < 0 ? clearInterval(timeToStart) : null;
      };
      const timeToStart = setInterval(timer, 1000);
      console.log(user[i].user_name);
      const table_row = document.createElement("tr");
      table_row.innerHTML = `<td class="ths">${user[i].room_number}</td>
            <td class="ths">${user[i].user_name}</td>
            <td class="ths">${user[i].reservation_date}</td>
            <td class="ths">${user[i].reservation_time}</td>
            <td class="ths time_to_start"></td>
            <td class="ths">time left</td>`;
      table_body.append(table_row);
      const now = new Date()
    const minutes  = now.getHours()
    console.log(parseInt(user[i].reservation_time)- minutes)
    }
    
  };
  getUsers();

  main_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const registration = {
      roomNumber: floatingRoomNumberGrid.value,
      userName: student_name.value,
      resgistrationNumber: floatingResgisterGrid.value,
      reservationTime: floatingSelectTimeGrid.value,
      reservationDate: floatingDateGrid.value,
    };
    try {
      if (registration.userName) {
        const { data, error } = await supabase
          .from("user")
          .insert([
            {
              room_number: `${registration.roomNumber}`,
              registration_number: `${registration.resgistrationNumber}`,
              user_name: `${registration.userName}`,
              reservation_date: `${registration.reservationDate}`,
              reservation_time: `${registration.reservationTime}`,
            },
          ])
          .select();
      }
    } catch (error) {
      console.log("Não consegui ");
    }

    const table_row = document.createElement("tr");

    table_row.innerHTML = `  <td class="ths">${registration.roomNumber}</td>
            <td class="ths">${registration.userName}</td>
            <td class="ths">${registration.reservation_date}</td>
            <td class="ths">${registration.reservationTime}</td>
            <td class="ths">time to begin</td>
            <td class="ths">time left</td>`;
    table_body.append(table_row);
    console.log(registration);
    main_form.reset();
  });

  cancelarBtn.addEventListener("click", () => {
    main_form.reset();
    console.log("resetado");
  });
});
