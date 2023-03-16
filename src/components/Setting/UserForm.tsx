/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default function UserForm({ user, id, customer }) {
  const [userData, setUserData] = useState(user);
  let router = useRouter();

  const handleChange = (event: any) => {
    setUserData((data: any) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.loading("Loading...")
    await axios.put(`/api/users/${id}`, userData);
    router.reload();
  };

  return (
    <>
      <div className="m-auto mt-5 max-w-lg md:col-span-2 md:mt-0">
        <h1 className="mt-2 text-3xl font-extrabold text-zinc-800 sm:text-center">
          Personal Information
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email-address"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street address
                  </label>
                  <input
                    type="text"
                    name="street_address"
                    id="street-address"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.street_address}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="region"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                  <label
                    htmlFor="zip-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal code
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    id="zip-code"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                    value={userData.zip_code}
                    onChange={handleChange}
                  />
                </div>
                {customer?.billingPlan === "business" && (
                  <fieldset className="col-span-6 border border-gray-300 p-5 pb-7">
                    <legend className="font-bold text-gray-700">
                      &nbsp; Company Information &nbsp;
                    </legend>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="company_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Company name
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        id="company_name"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                        value={userData.company_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </fieldset>
                )}
                {customer?.billingPlan === "lawyer" && (
                  <fieldset className="col-span-6 grid grid-cols-6 gap-6 border border-gray-300 p-5 pb-7">
                    <legend className="font-bold text-gray-700">
                      &nbsp; License Information &nbsp;
                    </legend>
                    <div className="col-span-3">
                      <label
                        htmlFor="license_country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        License Country
                      </label>
                      <input
                        type="text"
                        name="license_country"
                        id="license_country"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                        value={userData.license_country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <label
                        htmlFor="license_state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        License State
                      </label>
                      <input
                        type="text"
                        name="license_state"
                        id="license_state"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                        value={userData.license_state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </fieldset>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-pink-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
