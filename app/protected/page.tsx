"use client";
import SignOut from "@/components/sign-out";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";

import "react-datepicker/dist/react-datepicker.css";
import { User, Vacation } from "@prisma/client";
import axios from "axios";
export default function Home() {
  const [vacations, setVacations] = useState<Map<String, Vacation[]> | null>(null);

  async function fetchVacations() {
    const { data } = await axios.get("/api/vacations");
    const map1 = new Map();
    //@ts-ignore
    data.forEach((e) => {
      //@ts-ignore
      map1.set(new Date(e.id).toDateString(), e.vacations);
    });
    setVacations(map1);
    console.log(map1);
  }
  useEffect(() => {
    fetchVacations().catch(console.error);
  }, []);
  return vacations ? (
    <div className="flex flex-col justify-center items-center bg-black space-3">
      <div className="flex justify-between w-full p-2">
        <div className="flex flex-row space-x-5">
          <Modal />
        </div>

        <div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div>
        <Calendar
          className="max-h-[50%]"
          tileContent={({ activeStartDate, date, view }) => {
            console.log(date);
            const v = vacations.get(date.toDateString());
            // console.log({ v });
            if (v) {
              return v.map((e, i) => (
                //@ts-ignore
                <div key={i} className="p-6 flex flex-wrap space-y-1 text-sm">
                  <span className={`h-7 bg-${e.color ?? "blue-500"} text-white font-bold py-2 px-4 rounded-full w-40 text-start`}>
                    {
                      //@ts-ignore
                      e.user.email
                    }
                  </span>
                </div>
              ));
            }

            return <></>;
          }}
          // tileContent={
          //   <div className="p-6 flex flex-wrap space-y-1 text-sm">
          //     <span className="h-7 bg-blue-500 text-white font-bold py-2 px-4 rounded-full w-40 text-start">Martin</span>
          //   </div>
          // }
        />
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

function NewVacationsForm() {
  "use client";
  const [color, setColor] = useState("#dc2626");
  const [users, setUsers] = useState([]);

  <select
    name="color"
    id="color"
    value={color}
    style={{
      width: 50,
      height: 50,
      backgroundColor: color,
    }}
    onChange={(e) => setColor(e.target.value)}
  >
    {[
      "#dc2626",
      "#ea580c",
      "#d97706",
      "#ca8a04",
      "#65a30d",
      "#16a34a",
      "#059669",
      "#0d9488",
      "#0891b2",
      "#0284c7",
      "#2563eb",
      "#4f46e5",
      "#7c3aed",
      "#9333ea",
      "#c026d3",
      "#db2777",
      "#e11d48",
    ].map((e) => (
      <option
        key={e}
        value={e}
        style={{
          backgroundColor: e,
          width: 20,
          height: 20,
        }}
      ></option>
    ))}
  </select>;
}

function Modal() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [form, setForm] = useState<{
    userId: string;
    color?: string;
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(),
    //@ts-ignore
    userId: users.length > 0 ? users[0].id : 1,
  });
  const [color, setColor] = useState("#dc2626");

  useEffect(() => {
    fetch("/api/users")
      .then((e) => e.json())
      .then((res) => setUsers(res))
      .catch(console.error);
  }, []);
  async function onSubmit() {
    //@ts-ignore
    const getDaysArray = function (s, e) {
      for (var a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
        a.push(new Date(d));
      }
      return a;
    };
    await axios.post("/api/vacations", {
      days: [...getDaysArray(form.startDate, form.endDate), form.endDate],
      userId: form.userId,
      color: form.color,
    });
    // async (e) => {
    //   e.preventDefault();
    //   console.log(form);
    // };
  }
  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        CREATE VACATIONS
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Create vacations</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form className="relative p-6 flex-auto" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="price" className="text-sm font-medium leading-6 text-gray-900">
                      User
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      {users.length > 0 && (
                        <select
                          name="users"
                          id="users"
                          value={form?.userId}
                          onChange={(e) => {
                            setForm({ ...form, userId: e.target.value });
                          }}
                        >
                          {
                            //@ts-ignore
                            users.map((e: User) => (
                              //@ts-ignore
                              <option key={e} value={e.id}>
                                {e.email}
                              </option>
                            ))
                          }
                        </select>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="price" className="text-sm font-medium leading-6 text-gray-900">
                      Start date
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <DatePicker
                        minDate={new Date()}
                        selected={form?.startDate}
                        onChange={
                          //@ts-ignore
                          (date) => setForm({ ...form, startDate: date })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="price" className="text-sm font-medium leading-6 text-gray-900">
                      End date
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <DatePicker
                        minDate={new Date()}
                        selected={form?.endDate}
                        onChange={
                          //@ts-ignore
                          (date) => setForm({ ...form, endDate: date })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="price" className="text-sm font-medium leading-6 text-gray-900">
                      Color
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <select
                        name="color"
                        id="color"
                        value={color}
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: color,
                        }}
                        onChange={(e) => setColor(e.target.value)}
                      >
                        {[
                          "#dc2626",
                          "#ea580c",
                          "#d97706",
                          "#ca8a04",
                          "#65a30d",
                          "#16a34a",
                          "#059669",
                          "#0d9488",
                          "#0891b2",
                          "#0284c7",
                          "#2563eb",
                          "#4f46e5",
                          "#7c3aed",
                          "#9333ea",
                          "#c026d3",
                          "#db2777",
                          "#e11d48",
                        ].map((e) => (
                          <option
                            key={e}
                            value={e}
                            style={{
                              backgroundColor: e,
                              width: 20,
                              height: 20,
                            }}
                          ></option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      console.log(form);
                      onSubmit();
                      setShowModal(false);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
