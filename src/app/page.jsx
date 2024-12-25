"use client";
import Profile from "@/components/Profile";
import toast from "react-hot-toast";
import Language from "@/components/Language";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { LandingPage } from "@/components/LandingPage";
import SplitCard from "@/components/SplitCard";
import {
  FaCodeBranch,
  FaPlus,
  FaCalendarWeek,
  FaCalendarAlt,
} from "react-icons/fa";
import CoIssPull from "@/components/CoIssPull";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }
    setLoading(true);
    try {
      toast.loading("Fetching data...", {
        style: {
          background: "#212121",
          color: "#fff",
        },
      });
      const res = await fetch(`/api/github-api?username=${username}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch data");
      }
      const result = await res.json();
      localStorage.setItem("data", JSON.stringify(result));
      console.log("API response:", result);
      toast.dismiss();
      toast.success("Data fetched successfully", {
        duration: 2000,
        icon: "🎉",
        style: {
          background: "#212121",
          color: "#fff",
        },
      });

      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");

    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      useCORS: true, // Ensures proper handling of external images
      scale: 2, // Increases resolution
    });

    // Convert canvas to an image
    const imgData = canvas.toDataURL("image/png");

    // Initialize jsPDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions for the image to fit the PDF
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

    const imgWidth = canvasWidth * ratio * 0.264583; // Pixels to mm
    const imgHeight = canvasHeight * ratio * 0.264583;

    // Center the image on the PDF
    const x = (pdfWidth - imgWidth) / 2;
    const y = 10; // Top margin

    // Add image to the PDF
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(`${username}_github_report.pdf`);
  };

  const generateHeatmapData = () => {
    if (!data?.metrics?.commitDates) return [];
    const commitsByDate = data.metrics.commitDates;

    return Object.entries(commitsByDate).map(([date, count]) => ({
      date,
      count,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center my-8 p-6 w-full bg-black text-white">
      <LandingPage />
      <input
        type="text"
        placeholder="Enter GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="z-10 border p-2 bg-black text-white focus:outline-none py-3 px-6 duration-150 transition-all rounded-xl my-6 border-neutral-600 w-96"
      />
      <button
        onClick={handleSearch}
        className="z-10 bg-blue-600 text-white p-3 rounded-lg w-80"
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </button>
      {data && (
        <div id="report-content" className="z-10 mt-6 text-left w-full px-8">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex items-center gap-6 w-1/4">
              <img
                src={"https://github.com/" + username + ".png"}
                className="w-full h-full saturate-0"
              />
            </div>
            <div className="flex flex-col justify-between w-[60%] bg-neutral-900 h-full border-l border-neutral-600">
              <p className="text-4xl px-8 py-4 font-semibold">Heatmap</p>
              <p className="px-8 mb-4">Commits from Last Year</p>
              <div className="h-8"></div>
              <div className="p-4">
                <CalendarHeatmap
                  startDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 1)
                    )
                  }
                  endDate={new Date()}
                  values={generateHeatmapData()}
                  classForValue={(value) => {
                    if (!value) {
                      return `color-scale-69`;
                    }
                    return `color-scale-${Math.min(value.count, 4)}`;
                  }}
                  showWeekdayLabels
                  tooltipDataAttrs={(value) => {
                    return value.date
                      ? { "data-tip": `${value.date}: ${value.count} commits` }
                      : { "data-tip": "No commits" };
                  }}
                />
              </div>
            </div>
            <div className="w-[15%]">
              {data.metrics.topLanguages.map((language) => (
                <Language key={language} language={language} />
              ))}
            </div>
          </div>
          {/* Additional Content */}
          <Profile
            blogs={data.metrics.blogs}
            followers={data.user.followers}
            following={data.user.following}
            public_repos={data.user.public_repos}
            stars={data.metrics.totalStars}
          />
          <div className="flex justify-between">
            <CoIssPull
              totalCommits={data.metrics.totalCommits}
              totalPullRequests={data.metrics.totalPRs}
            />
            <SplitCard
              number1={data.metrics.openIssues}
              number2={data.metrics.closedIssues}
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <StatCard
              icon={<FaCalendarAlt className="text-amber-500" />}
              label="Active Month"
              value={getMonthName(data.metrics.mostFrequentMonth)}
            />
            <StatCard
              icon={<FaCalendarWeek className="text-blue-500" />}
              label="Active Day"
              value={getWeekdayName(data.metrics.mostFrequentWeekday)}
            />
            <StatCard
              icon={<FaPlus className="text-green-500" />}
              label="New Repos Created"
              value={data.metrics.newReposCount}
            />
            <StatCard
              icon={<FaCodeBranch className="text-purple-500" />}
              label="New Repos Forked"
              value={data.metrics.newForksCount}
            />
          </div>
        </div>
      )}
      {data && (
        <button
          onClick={handleDownloadPDF}
          className="mt-4 z-10 bg-green-600 text-white p-3 rounded-lg w-80"
        >
          Download Report as PDF
        </button>
      )}
    </div>
  );
}

function getMonthName(monthIndex) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex] || "Unknown";
}

function getWeekdayName(weekdayIndex) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[weekdayIndex] || "Unknown";
}
