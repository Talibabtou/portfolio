import AboutMe from '@/app/_components/AboutMe';
import Banner from '@/app/_components/Banner';
import Experiences from '@/app/_components/Experiences';
import Skills from '@/app/_components/Skills';
import ProjectList from '@/app/_components/ProjectList';

export default function Home() {
  return (
    <div className="page-">
      <Banner />
      <AboutMe />
      <Skills />
      <Experiences />
      <ProjectList />
    </div>
  );
}
