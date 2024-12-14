import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const supabaseUrl = "https://cqidqrqcwnptczzmhdwi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxaWRxcnFjd25wdGN6em1oZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NTA4MjksImV4cCI6MjA0OTUyNjgyOX0.ahANrBL_lrvMdXWVLMhP_h-1GvUzOwzZay7x3zP2wFI";
const supabase = createClient(supabaseUrl, supabaseKey);

function updateCountdown() {
  const countdownElements = document.querySelectorAll('.countdown');
  const timeLeftElements = document.querySelectorAll('.time_left');
  const now = dayjs();

  countdownElements.forEach((element, index) => {
    const timeLeftElement = timeLeftElements[index];
    const reservationDate = dayjs(`${element.dataset.date} ${element.dataset.time}`);
    const diff = reservationDate.diff(now);
    const endTime = reservationDate.add(60, 'minute');
    const timeLeftDiff = endTime.diff(now);

    if (diff <= 0 && timeLeftDiff > 0) {
      // Reserva em andamento
      element.innerHTML = `<span class="text-bg-success rounded p-1">Em andamento</span> `;
      const duration = dayjs.duration(timeLeftDiff);
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      timeLeftElement.innerHTML = `${minutes}m ${seconds}s </i>`;
    } else if (timeLeftDiff <= 0) {
      // Reserva finalizada
      element.innerHTML = '<span class="text-bg-primary rounded p-1">Concluída</span>';
      timeLeftElement.innerHTML = '<span class="text-bg-secondary rounded p-1">Finalizada</span>';
    } else {
      // Ainda não começou
      const duration = dayjs.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      let countdownText = '';
      if (days > 0) countdownText += `${days}d `;
      if (hours > 0) countdownText += `${hours}h `;
      if (minutes > 0) countdownText += `${minutes}m `;
      countdownText += `${seconds}s`;

      element.textContent = countdownText;
      timeLeftElement.innerHTML = '60m 0s ';
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const main_form = document.querySelector("#meuForm");
  const student_name = document.querySelector("#floatingNameGrid");
  const cancelarBtn = document.querySelector(".cancel_button");
  const room_number = document.querySelector("#floatingRoomNumberGrid");
  const registration_number = document.querySelector("#floatingResgisterGrid");
  const reservation_time = document.querySelector("#floatingSelectTimeGrid");
  const reservation_date = document.querySelector("#floatingDateGrid");
  const table_body = document.querySelector(".table_body");

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  };

  const getUsers = async () => {
    let { data: users, error } = await supabase.from("user").select("*");

    if (error) {
      console.error("Erro ao buscar usuários:", error);
      return;
    }

    if (!users || users.length === 0) {
      console.log("Nenhum usuário encontrado");
      return;
    }

    table_body.innerHTML = "";

    users.forEach((user) => {
      const table_row = document.createElement("tr");
      table_row.innerHTML = `
  <td class="ths">${user.room_number}</td>
  <td class="ths">${user.user_name}</td>
  <td class="ths">${formatDate(user.reservation_date)}</td>
  <td class="ths">${formatTime(user.reservation_time)}</td>
  <td class="countdown ths" data-date="${user.reservation_date}" data-time="${
        user.reservation_time
      }"></td>
      <td class="ths time_left"></td>
  <td class="border-0">
  
  <i class="bi bi-trash btn-remove text-primary" data-id="${
    user.id
  }"></i>
  </td>
`;
      table_body.append(table_row);
    });
    updateCountdown();
    setInterval(updateCountdown, 1000);
    addRemoveListeners();
  };

  const addRemoveListeners = () => {
    document.querySelectorAll(".btn-remove").forEach((button) => {
      button.addEventListener("click", handleRemove);
    });
  };

  const handleRemove = async (e) => {
    const row = e.target.closest("tr");
    const id = e.target.dataset.id;

    try {
      const { error } = await supabase.from("user").delete().eq("id", id);

      if (error) throw error;
      row.remove();
    } catch (error) {
      console.error("Erro ao remover reserva:", error);
    }
  };

  main_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const registration = {
      roomNumber: room_number.value,
      userName: student_name.value,
      resgistrationNumber: registration_number.value,
      reservationTime: reservation_time.value,
      reservationDate: reservation_date.value,
    };

    try {
      if (registration.userName) {
        const { data, error } = await supabase
          .from("user")
          .insert([
            {
              room_number: registration.roomNumber,
              registration_number: registration.resgistrationNumber,
              user_name: registration.userName,
              reservation_date: registration.reservationDate,
              reservation_time: registration.reservationTime,
            },
          ])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          const table_row = document.createElement("tr");
          table_row.innerHTML = `
          <td class="ths">${registration.roomNumber}</td>
          <td class="ths">${registration.userName}</td>
          <td class="ths">${formatDate(registration.reservationDate)}</td>
          <td class="ths">${formatTime(registration.reservationTime)}</td>
          <td class="countdown ths" data-date="${
            registration.reservationDate
          }" data-time="${registration.reservationTime}"></td>
          <td class="ths time_left"></td>
          <td class="border-0">
          <i class="bi bi-trash btn-remove text-primary" data-id="${
            data[0].id
          }"></i></td>
        `;

          table_body.append(table_row);
          addRemoveListeners();
        }
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
    updateCountdown();
    main_form.reset();
  });

  cancelarBtn.addEventListener("click", () => {
    main_form.reset();
  });

  getUsers();
});
