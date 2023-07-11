import axios, { AxiosResponse } from 'axios';

interface Repository {
  name: string;
  owner: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
}

interface Contributor {
  login: string;
  contributions: number;
}

interface Language {
  name: string;
  bytesOfCode: number;
}

class GitHubRepositoryAnalyzer {
  async analyzeRepository(owner: string, repo: string): Promise<void> {
    try {
      const repository = await this.getRepository(owner, repo);
      this.displayRepositoryInfo(repository);
      
      const contributors = await this.getContributors(owner, repo);
      this.displayContributors(contributors);

      const languages = await this.getLanguages(owner, repo);
      this.displayLanguages(languages);
    } catch (error) {
      console.error(`Error: ${(error as any).message}`);
    }
  }

  private async getRepository(owner: string, repo: string): Promise<Repository> {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    const response: AxiosResponse<Repository> = await axios.get(url);
    return response.data;
  }

  private displayRepositoryInfo(repository: Repository): void {
    console.log(`Repository: ${repository.owner}/${repository.name}`);
    console.log(`Stars: ${repository.stargazers_count}`);
    console.log(`Forks: ${repository.forks_count}`);
    console.log(`Created at: ${repository.created_at}`);
  }

  private async getContributors(owner: string, repo: string): Promise<Contributor[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors`;
    const response: AxiosResponse<Contributor[]> = await axios.get(url);
    return response.data;
  }

  private displayContributors(contributors: Contributor[]): void {
    console.log('\nContributors:');
    contributors.forEach((contributor) => {
      console.log(`${contributor.login} - Contributions: ${contributor.contributions}`);
    });
  }

  private async getLanguages(owner: string, repo: string): Promise<Language[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
    const response: AxiosResponse<Language[]> = await axios.get(url);
    return response.data;
  }

  private displayLanguages(languages: Language[]): void {
    console.log('\nLanguages:');
    // Check if languages is an array
    if (Array.isArray(languages)) {
      // Iterate over the languages array
      languages.forEach((language) => {
        console.log(language);
      });
    } else {
      console.log('No language information available');
    }
  }
}

// Usage: node analyze-repo.ts <owner> <repo>
const [owner, repo] = process.argv.slice(2);
const analyzer = new GitHubRepositoryAnalyzer();
analyzer.analyzeRepository(owner, repo);