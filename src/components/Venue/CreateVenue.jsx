import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { userContext } from "../../Context/UserContext";
import ServerApi from "../../serverApi/axios";
import { useNavigate } from "react-router";

const CreateVenue = () => {
  const { register, handleSubmit, reset, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  const [employeeName, setEmployeeName] = useState("");
  const [employeeWage, setEmployeeWage] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await ServerApi.post("/api/v1/venue/venues", data);
      console.log("Venue created successfully:", response.data);
      reset(); // Reset the form after successful submission
      navigate("/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
    }
  };
  const addEmployee = () => {
    append({
      name: employeeName,
      email: employeeEmail,
      hourlyWage: employeeWage,
    });
    setEmployeeName("");
    setEmployeeWage("");
    setEmployeeEmail("");
  };
  const { state } = userContext();
  return (
    <div className="p-6">
      <h2 className=" font-bold text-2xl">Venues</h2>
      <div className="my-2">
        {state.loggedIn && <>Hello {state.userData.name}</>}
      </div>
      <div className="mx-auto  max-w-[900px] mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create New Venue</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              placeholder="Venue Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register("address")}
              type="text"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              placeholder="Venue Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              {...register("phone")}
              type="text"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              placeholder="Venue Phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Opening Hours
            </label>
            <div className="space-y-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <span className="w-20">{day}</span>
                  <input
                    {...register(`openingHours.${day.toLowerCase()}.open`)}
                    type="time"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    {...register(`openingHours.${day.toLowerCase()}.close`)}
                    type="time"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Staff
            </label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`employees.${index}.name`, { required: true })}
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Employee Name"
                  />
                  <input
                    {...register(`employees.${index}.email`, {
                      required: true,
                    })}
                    type="text"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Employee Email"
                  />
                  <input
                    {...register(`employees.${index}.hourlyWage`, {
                      required: true,
                    })}
                    type="number"
                    className="p-2 border border-gray-300 rounded-md"
                    placeholder="Hourly Wage"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Employee Name"
                />
                <input
                  type="text"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Employee Email"
                />
                <input
                  type="number"
                  value={employeeWage}
                  onChange={(e) => setEmployeeWage(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Hourly Wage"
                />
                <button
                  type="button"
                  onClick={addEmployee}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Venue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVenue;
