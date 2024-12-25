import { VscIssues } from "react-icons/vsc";
import { GoIssueClosed } from "react-icons/go";

const DiagonalSplitCard = ({ number1, number2 }) => {
  return (
    <div className="relative w-full h-full border-[1px] border-neutral-700 bg-neutral-900">
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 100,0 0,100" className="fill-white" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-1/2 h-1/2 flex justify-center items-end gap-6">
        <VscIssues size={45} className="text-green-600" />
        <span className="text-6xl font-bold text-black">{number1}</span>
        <p className="text-black font-bold">Open Issues</p>
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-[50%] flex justify-center items-baseline gap-6">
        <GoIssueClosed size={40} className="text-purple-500" />
        <span className="text-6xl font-bold text-neutral-200">{number2}</span>
        <p className="text-white font-bold">Closed Issues</p>
      </div>
    </div>
  );
};

export default function SplitCard({ number1, number2 }) {
  return (
    <div className="w-1/2">
      <DiagonalSplitCard number1={number1} number2={number2} />
    </div>
  );
}
