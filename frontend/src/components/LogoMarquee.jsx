const logos = [
  { name: "Microsoft" },
  { name: "Google" },
  { name: "Amazon" },
  { name: "Apple" },
  { name: "IBM" },
  { name: "Oracle Corporation" },
  { name: "Intel" },
  { name: "Cisco Systems" },
  { name: "Accenture" },
  { name: "Capgemini" },
  { name: "Cognizant" },
  { name: "Tata Consultancy Services" },
  { name: "Infosys" },
  { name: "Wipro" },
  { name: "HCLTech" },
  { name: "Tech Mahindra" },
  { name: "DXC Technology" },
  { name: "NTT Data" },
  { name: "SAP" },
  { name: "ServiceNow" },
  { name: "Workday" },
  { name: "Snowflake" },
  { name: "Atlassian" },
  { name: "VMware" },
  { name: "Red Hat" },
  { name: "Palantir Technologies" },
  { name: "Databricks" },
  { name: "UiPath" },
  { name: "NVIDIA" },
  { name: "AMD" },
  { name: "Qualcomm" },
  { name: "Broadcom" },
  { name: "Micron Technology" },
  { name: "Texas Instruments" },
  { name: "Samsung Electronics" },
  { name: "Sony" },
  { name: "Lenovo" },
  { name: "HP Inc." },
  { name: "Meta Platforms" },
  { name: "Uber Technologies" },
  { name: "Airbnb" },
  { name: "PayPal" },
  { name: "Stripe" },
  { name: "Dropbox" },
  { name: "Zoom Video Communications" },
  { name: "Shopify" },
  { name: "Electronic Arts" },
  { name: "Intuit" },
  { name: "Adobe" },
];

function Mark() {
  return (
    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
      <span className="h-3 w-3 rounded-full bg-sky-400/80 shadow-[0_0_30px_rgba(56,189,248,0.4)]" />
    </span>
  );
}

function Row() {
  return (
    <div className="flex items-center gap-6 whitespace-nowrap">
      {logos.map((l) => (
        <div
          key={l.name}
          className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
        >
          <Mark />
          <span className="font-medium tracking-tight text-slate-100/90">{l.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950/80 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950/80 to-transparent" />
      <div className="flex gap-6 p-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-[marquee_22s_linear_infinite]">
          <Row />
        </div>
        <div className="animate-[marquee_22s_linear_infinite]">
          <Row />
        </div>
      </div>
    </div>
  );
}

