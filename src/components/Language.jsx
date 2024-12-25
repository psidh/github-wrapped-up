import {
  FaPython,
  FaJsSquare,
  FaJava,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaRust,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiRuby,
  SiPhp,
  SiCplusplus,
  SiDart,
} from 'react-icons/si';

const LanguageCard = ({ language }) => {
  const icons = {
    Python: <FaPython className="text-9xl" />,
    JavaScript: <FaJsSquare className="text-9xl" />,
    Java: <FaJava className=" text-9xl" />,
    React: <FaReact className="text-9xl" />,
    HTML: <FaHtml5 className="text-9xl" />,
    CSS: <FaCss3Alt className="text-9xl" />,
    TypeScript: <SiTypescript className="text-9xl" />,
    Ruby: <SiRuby className="text-9xl" />,
    PHP: <SiPhp className="text-9xl" />,
    'C++': <SiCplusplus className="text-9xl" />,
    Dart: <SiDart className="text-9xl" />,
    Rust: <FaRust className="text-9xl" />,
  };

  return (
    <div className="flex flex-col justify-between items-start p-8 h-full border-[1px] border-neutral-700 text-white">
      <h1 className="text-6xl bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-neutral-700 font-bold">#1</h1>
      <p>{icons[language]}</p>
    </div>
  );
};

export default LanguageCard;
