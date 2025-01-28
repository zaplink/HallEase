"use client";

import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

function Requestpage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200 rounded-lg">
        <CardHeader>
          <CardTitle className="text-center">
            Request Details Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-left">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Request ID
                  </td>
                  <td className="border border-gray-300 px-4 py-2">1002</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Request Date
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    2025-01-01
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Request Time
                  </td>
                  <td className="border border-gray-300 px-4 py-2">11.11 AM</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Requested By
                  </td>
                  <td className="border border-gray-300 px-4 py-2">John Doe</td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="border border-gray-300 px-6 py-3 font-medium text-gray-600 bg-gray-100"
                  ></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Event Name
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Dream Big 2025 Conference
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Event Type
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Seminar</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Organized By
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Innovative Society
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Event Description
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    An inspiring event that brings creative minds together.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Number of Attendees
                  </td>
                  <td className="border border-gray-300 px-4 py-2">100</td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Hall/Location
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    AB-LCH-01
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Contact Email
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    example@domain.com
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Contact Phone
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    (123) 456-7890
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    Special Requests
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Please arrange extra chairs.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div className="flex justify-start gap-6 mt-6">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md">
              Approve
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md">
              Reject
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Requestpage;
