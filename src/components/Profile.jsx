import {
  RiGitRepositoryCommitsLine,
  RiUserFollowFill,
  RiUserFollowLine,
  RiBloggerFill,
} from 'react-icons/ri';
import { FaStar } from 'react-icons/fa';
export default function Profile({
  public_repos,
  followers,
  following,
  blogs,
  stars,
}) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col  gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-start">
          <RiGitRepositoryCommitsLine size={35} className="text-amber-600" />
          <p className="text-7xl font-semibold">{public_repos}</p>
        </div>
        <p className="w-full font-semibold text-lg">Public Repositories</p>
      </div>
      <div className="flex flex-col  gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-start">
          <RiUserFollowFill size={35} />
          <p className="text-7xl font-semibold">{followers}</p>
        </div>
        <p className="font-semibold text-lg">Followers</p>
      </div>
      <div className="flex flex-col  gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-start">
          <RiUserFollowLine size={35} />
          <p className="text-7xl font-semibold">{following}</p>
        </div>
        <p className="font-semibold text-lg">Following</p>
      </div>
      <div className="flex flex-col  gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-start">
          <FaStar size={35} className="text-yellow-500" />
          <p className="text-7xl font-semibold">{stars}</p>
        </div>
        <p className="font-semibold text-lg">GitHub Stars</p>
      </div>
      {/* <div className="flex flex-col  gap-4 border-[1px] border-neutral-700 p-6 w-full">
        <div className="flex justify-between items-center gap-2">
          <RiBloggerFill size={35} className=" " />
          <a
            href={`https://${blogs}`}
            target="_blank"
            className="text-xl hover:underline underline-offset-4 hover:text-blue-500 font-semibold"
          >
            {blogs}
          </a>
        </div>
        <p className="font-semibold text-lg">Blog</p>
      </div> */}
    </div>
  );
}
