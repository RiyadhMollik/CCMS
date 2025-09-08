import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const API_URL = "https://iinms.brri.gov.bd/api/users/login";

  // Get user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          password,
          userLat: userLocation?.lat,
          userLng: userLocation?.lng,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }
      // Store user ID in localStorage
      localStorage.setItem("userId", data.user.id);
      toast.success("Login successful!");

      // Check if user is Agromet Scientist and has active meetings
      //   if (data.isAgrometScientist && data.activeMeetings && data.activeMeetings.length > 0) {
      //     const meetingMessages = data.activeMeetings.map(meeting =>
      //       `${meeting.title}: ${meeting.message}`
      //     ).join('\n');

      // const shouldProceed = window.confirm(
      //   `Welcome! You have active meetings:\n\n${meetingMessages}\n\nWould you like to proceed to the attendance page?`
      // );

      window.location.href = "/";

      if (data.isAgrometScientist) {
        let message = "Welcome! ";

        // Check for auto-marked meetings
        if (data.autoMarkedMeetings && data.autoMarkedMeetings.length > 0) {
          const autoMarkedMessages = data.autoMarkedMeetings
            .map((meeting) => `✅ ${meeting.title}: ${meeting.message}`)
            .join("\n");
          message += `\n\n🎉 Attendance automatically marked for:\n${autoMarkedMessages}`;
        }

        // Check for other meetings (too far, etc.)
        if (data.otherMeetings && data.otherMeetings.length > 0) {
          const otherMessages = data.otherMeetings
            .map((meeting) => `ℹ️ ${meeting.title}: ${meeting.message}`)
            .join("\n");
          message += `\n\n📋 Other meetings:\n${otherMessages}`;
        }

        // if (
        //   data.autoMarkedMeetings?.length > 0 ||
        //   data.otherMeetings?.length > 0
        // ) {
        //   const shouldProceed = window.confirm(
        //     `${message}\n\nWould you like to proceed to the attendance page?`
        //   );

        //   if (shouldProceed) {
        //     window.location.href = "/attendance";
        //   } else {
        //     window.location.href = "/";
        //   }
        // } else {
        //   // No active meetings
        //   window.location.href = "/";
        // }
      } else {
        // Redirect to the home page
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* Rice field background image from public folder */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/rice3.avif')",
        }}
      ></div>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Subtle teal overlay to match theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#026666]/15 via-transparent to-[#024444]/15"></div>

      {/* Subtle floating elements using sidebar colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-[#04cccc] opacity-30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#026666] opacity-30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-[#338485] opacity-25 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-[#024444] opacity-30 rounded-full animate-float-delayed"></div>
      </div>

      {/* Main login container */}
      <div className="bg-white/98 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md z-10 relative border border-[#04cccc]/20">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="BRRI CCMS Logo" className="w-20" />
          </div>
          <h1 className="text-3xl font-bold text-[#026666] mb-2">BRRI CCMS</h1>
          <p className="text-[#338485]">Call Center Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#026666] focus:border-[#04cccc] transition duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#026666] focus:border-[#04cccc] transition duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 text-sm font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-[#026666] to-[#024444] text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-[#035555] hover:to-[#026666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#04cccc] transition duration-300 transform hover:scale-[1.02] border border-[#04cccc]/20 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#338485]">Agromet Lab</p>
          <p className="text-base text-[#026666]/70 font-medium mt-1">
            Bangladesh Rice Research Institute
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
