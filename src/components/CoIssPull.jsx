import { IoGitCommitSharp } from 'react-icons/io5';
import { FaCodePullRequest } from 'react-icons/fa6';


export default function CoIssPull({
  totalCommits,
  totalPullRequests,
}) {
  return (
    <div className="flex w-1/2">
      <div className="flex flex-col justify-start gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-center">
          <IoGitCommitSharp size={40} className="text-blue-600" />
          <p className="text-7xl font-semibold">{totalCommits}</p>
        </div>
        <p className="font-semibold text-lg">
          Total Commits
        </p>
      </div>
      <div className="flex flex-col gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-center">
          <FaCodePullRequest size={40} className="text-purple-500" />
          <p className="text-7xl font-semibold">{totalPullRequests}</p>
        </div>
        <p className="font-semibold text-lg">
          Pull Requests
        </p>
      </div>
    </div>
  );
}
