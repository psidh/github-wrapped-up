import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  console.log('username: ' + username);

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const BASE_URL = 'https://api.github.com';
    const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };

    // Fetch user data
    const userRes = await axios.get(`${BASE_URL}/users/${username}`, {
      headers,
    });
    const user = userRes.data;

    // Fetch repos data
    const reposRes = await axios.get(
      `${BASE_URL}/users/${username}/repos?per_page=100`,
      { headers }
    );
    const repos = reposRes.data;

    // Calculate commits in the last year
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const commitPromises = repos.map(async (repo) => {
      try {
        const commitsRes = await axios.get(
          `${BASE_URL}/repos/${username}/${repo.name}/commits`,
          {
            headers,
            params: {
              since: oneYearAgo.toISOString(),
              until: currentDate.toISOString(),
            },
          }
        );
        return commitsRes.data.length;
      } catch {
        return 0;
      }
    });

    const commitCounts = await Promise.all(commitPromises);
    const totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);

    // Determine top languages
    const languageCounts = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([language]) => language);

    // Fetch PRs and issues
    const prsRes = await axios.get(
      `${BASE_URL}/search/issues?q=type:pr+author:${username}&per_page=100`,
      { headers }
    );
    const totalPRs = prsRes.data.total_count;

    const mergedPRsRes = await axios.get(
      `${BASE_URL}/search/issues?q=type:pr+is:merged+author:${username}&per_page=100`,
      { headers }
    );
    const totalMergedPRs = mergedPRsRes.data.total_count;

    const issuesRes = await axios.get(
      `${BASE_URL}/search/issues?q=type:issue+author:${username}&per_page=100`,
      { headers }
    );
    const issues = issuesRes.data.items;
    const openIssues = issues.filter((issue) => issue.state === 'open').length;
    const closedIssues = issues.filter(
      (issue) => issue.state === 'closed'
    ).length;

    // Calculate activity frequency
    const monthlyCommits = Array(12).fill(0);
    const dailyCommits = Array(7).fill(0);

    const activityPromises = repos.map((repo) =>
      axios
        .get(
          `${BASE_URL}/repos/${username}/${repo.name}/stats/commit_activity`,
          {
            headers,
          }
        )
        .then((res) => {
          res.data.forEach((week) => {
            const weekDate = new Date(week.week * 1000);
            const month = weekDate.getMonth();
            monthlyCommits[month] += week.total;

            week.days.forEach((count, dayIndex) => {
              dailyCommits[dayIndex] += count;
            });
          });
        })
        .catch(() => null)
    );

    await Promise.all(activityPromises);

    const mostFrequentMonth = monthlyCommits.indexOf(
      Math.max(...monthlyCommits)
    );
    const mostFrequentWeekday = dailyCommits.indexOf(Math.max(...dailyCommits));

    // Count new repos and forks in the current year
    const currentYear = new Date().getFullYear();
    const newReposCount = repos.filter(
      (repo) => new Date(repo.created_at).getFullYear() === currentYear
    ).length;

    const newForksCount = repos.filter(
      (repo) =>
        repo.fork && new Date(repo.created_at).getFullYear() === currentYear
    ).length;

    // Calculate total stars
    let totalStars = 0;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const starsRes = await axios.get(
        `${BASE_URL}/users/${username}/repos?per_page=100&page=${page}`,
        { headers }
      );
      const reposPage = starsRes.data;

      if (reposPage.length > 0) {
        totalStars += reposPage.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        );
        page++;
      } else {
        hasMore = false;
      }
    }

    const commitDates = {};
    const commitPromises2 = repos.map(async (repo) => {
      try {
        const commitsRes = await axios.get(
          `${BASE_URL}/repos/${username}/${repo.name}/commits`,
          {
            headers,
            params: {
              since: oneYearAgo.toISOString(),
            },
          }
        );
        commitsRes.data.forEach((commit) => {
          const commitDate = commit.commit.author.date.split('T')[0];
          commitDates[commitDate] = (commitDates[commitDate] || 0) + 1;
        });
        return commitsRes.data.length; // Number of commits in this repo
      } catch (error) {
        console.error(
          `Error fetching commits for repo ${repo.name}:`,
          error.message
        );
        return 0;
      }
    });

    await Promise.all(commitPromises2);

    return NextResponse.json({
      user,
      metrics: {
        topLanguages,
        totalCommits,
        totalPRs,
        totalMergedPRs,
        totalStars,
        openIssues,
        closedIssues,
        mostFrequentMonth,
        mostFrequentWeekday,
        newReposCount,
        newForksCount,
        commitDates,
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
