const About = () => {
  const patrons = [
    {
      title: "Chief Parton",
      name: "Dr. Mohammad Khalequzzaman",
      designation: "Director General (Routine Charge)",
      image: "/brri-dg-2.jpeg", // Replace with actual path
    },
    {
      title: "Parton",
      name: "Dr. Md Rafiqul Islam",
      designation: "Director (Research), BRRI",
      image: "/brri-da.jpg", // Replace with actual path
    },
  ];
  const reviewers = [
    {
      name: "Dr. ABM Zahid Hossain",
      designationLine1: "SSO, IWM Division",
      designationLine2: "& Labrotory Coordinator, Agromet Lab, BRRI",
      image: "/zahid.jpg", // Replace with actual path
    },
    {
      name: "Dr. Abubakar Siddique",
      designationLine1: "SSO, GRS Division",
      designationLine2: "& Member, Agromet Lab, BRRI",
      image: "/abu-bakkar.jpg", // Replace with actual path
    },
  ];
  return (
    <div className="min-h-screen max-w-full font-book-antiqua  bg-green-50 flex flex-col items-center justify-center p-6">
      <div className=" bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Smart Agro-Advisory Dissemination System
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">          Background and Rationale
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
          Bangladesh, as a predominantly agrarian economy, relies heavily on rice production for food security and livelihood. However, the agriculture sector faces significant challenges due to climate change and unpredictable weather patterns, such as erratic rainfall, heatwaves, droughts, and floods. These challenges are particularly critical for rice, the country’s staple crop, which is highly sensitive to climatic variability.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
          To address these challenges, a location-specific and stage-wise Agromet advisory service is crucial. Such a service can provide farmers with tailored advisories on irrigation, pest management, fertilizer application, and disaster preparedness at various crop growth stages. To implement this effectively, a robust and dynamic web-based and mobile-responsive Farmer’s Information System is required. This digital platform will facilitate data collection, integration, and dissemination, enabling real-time, actionable advisories for rice farmers across Bangladesh.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Objectives</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>To develop a web-based and mobile-responsive platform for maintaining a comprehensive Farmer’s Information List.</li>
          <li>To integrate location-specific data such as GPS coordinates, agro-ecological zones, and local weather conditions.</li>
          <li>To align farmer data with rice crop growth stages, enabling tailored, stage-wise Agromet advisories.</li>
          <li>To establish a mechanism for the dissemination of location-specific and stagewise advisories to farmers.</li>
          <li>To pilot the platform in key rice-growing regions for usability and effectiveness assessment.</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 p-6 bg-white shadow-lg rounded-lg w-full mt-5">
        {patrons.map((patron, index) => (
          <div key={index} className="text-center">
            <h3 className="text-xl font-semibold mb-4">{patron.title}</h3>
            <img
              src={patron.image}
              alt={patron.name}
              className="w-60 h-72 object-cover mx-auto border border-gray-300"
            />
            <h4 className="mt-4 text-lg font-bold">{patron.name}</h4>
            <p className="text-gray-700">{patron.designation}</p>
          </div>
        ))}
      </div>
      <div className="px-6 py-8 bg-white shadow-lg rounded-lg w-full mt-5">
        <h3 className="text-lg font-semibold mb-6">Reviewed by-</h3>
        <div className="flex flex-col md:flex-row justify-center items-start gap-12">
          {reviewers.map((reviewer, index) => (
            <div key={index} className="text-center">
              <img
                src={reviewer.image}
                alt={reviewer.name}
                className="w-60 h-72 object-cover mx-auto border border-gray-300"
              />
              <h4 className="mt-4 text-lg font-bold">{reviewer.name}</h4>
              <p className="text-gray-700">{reviewer.designationLine1}</p>
              <p className="text-gray-700">{reviewer.designationLine2}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-8 bg-white  shadow-lg rounded-lg w-full mt-5">
        <h3 className="text-lg font-semibold mb-4">Plan, Databse & Execution By:</h3>
        < div className="flex flex-col md:flex-row justify-center items-start gap-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src="/niaz.jpg" // replace with correct image path
              alt="Niaz Md. Farhat Rahman"
              className="w-60 h-72 object-cover border border-gray-300"
            />
            <div>
              <h4 className="text-lg font-bold mb-1">Niaz Md. Farhat Rahman</h4>
              <p>Principal Scientific Officer</p>
              <p>Agricultural Statistics Division</p>
              <p>& Member, Agromet Lab</p>
              <p>Bangladesh Rice Research Institute (BRRI)</p>
              <p>Gazipur-1701, Bangladesh.</p>
              <p>Email: <a href="mailto:niaz.stat@brri.gov.bd" className="text-blue-600 underline">niaz.stat@brri.gov.bd</a>, <a href="mailto:niaz.sust@gmail.com" className="text-blue-600 underline">niaz.sust@gmail.com</a></p>
              <p>Mobile: +8801912700606</p>
              <p>Phone: PABX 880-2-49272005-14 Ext. 395</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
