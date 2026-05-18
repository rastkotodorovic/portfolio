import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Rastko",
  lastName: "Todorovic",
  name: `Rastko Todorovic`,
  role: "Backend Software Engineer",
  avatar: "/images/avatar.jpg",
  email: "rale.todorovic2@gmail.com",
  location: "Europe/Sarajevo", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Balkan"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/rastkotodorovic",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/rastko-todorovi%C4%87-393263234",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/once_ui/",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building bridges between design and code</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
    I'm Rastko, a software engineer at <Text as="span" size="xl" weight="strong">ONCE UI</Text>, where I craft intuitive <br /> user experiences. After hours, I build my own projects.
</>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        <Text as="p">
          Backend Software Engineer focused on scalable backend systems, complex integrations, infrastructure, and AI-enabled engineering.
        </Text>
        
        <Text as="p">
          I have 6+ years of experience building production applications with Symfony/PHP as my main backend stack, while also working extensively with TypeScript, Node.js, React/Next.js, Docker, Redis, RabbitMQ, PostgreSQL/MariaDB, and CI/CD pipelines.
        </Text>
        
        <Text as="p">
          My work focuses on backend APIs, third-party platform integrations, asynchronous workflows, message queues, webhooks, performance optimization, and reliable production architecture. I’ve worked on complex integrations involving Booking.com, Airbnb, Vrbo, authentication systems, payment flows, and business-critical internal APIs.
        </Text>
        
        <Text as="p">
          Beyond application development, I also work with infrastructure and DevOps-oriented systems, including Docker Swarm, containerized deployments, Traefik/Nginx, cloud environments, monitoring, deployment automation, and production debugging.
        </Text>
        
        <Text as="p">
          I use AI tools daily as part of my engineering workflow and have helped teams improve delivery efficiency through AI-assisted development, better technical planning, documentation, and review processes. I’m especially interested in AI engineering, agent-assisted workflows, automation, and building the backend and infrastructure foundations needed for intelligent products.
        </Text>
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Mabbly (Tiger21)",
        timeframe: "Sep 2025 - Present",
        role: "Senior Backend/Infrastructure Software Engineer",
        links: [
          {
            label: "Mabbly",
            href: "https://mabbly.com",
          },
          {
            label: "TIGER 21",
            href: "https://tiger21.com",
          },
        ],
        achievements: [
          <>
            Redesigned the UI/UX for the FLY platform, resulting in a 20% increase in user
            engagement and 30% faster load times.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows, enabling designers to
            iterate 50% faster.
          </>,
        ],
        images: [],
      },
      {
        company: "SECRA (HomeToGo)",
        timeframe: "Mar 2022 - Sep 2025",
        role: "Software Engineer",
        links: [
          {
            label: "SECRA",
            href: "https://secra.de",
          },
          {
            label: "HomeToGo",
            href: "https://hometogo.com",
          },
        ],
        achievements: [
          <>
            Developed a design system that unified the brand across multiple platforms, improving
            design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line, contributing to a 15% increase
            in overall company revenue.
          </>,
        ],
        images: [],
      },
      {
        company: "Restart IT",
        timeframe: "Apr 2020 - Mar 2022",
        role: "Full stack software developer",
        link: "https://restartit.me",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple platforms, improving
            design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line, contributing to a 15% increase
            in overall company revenue.
          </>,
        ],
        images: [],
      },
      {
        company: "Vertex IT",
        timeframe: "Jun 2019 - Apr 2020",
        role: "Software developer Internship",
        link: "https://vertex-it.com",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple platforms, improving
            design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line, contributing to a 15% increase
            in overall company revenue.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University Sinergija",
        link: "https://sinergija.edu.ba/en/english/",
        description: <>Studied software engineering.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Backend",
        description: (
          <>Building scalable backend systems, APIs, integrations, queues, and admin workflows with Symfony, Laravel, PHP, and TypeScript/Node.js.</>
        ),
        tags: [
          {
            name: "Symfony",
            icon: "symfony",
          },
          {
            name: "PHP",
            icon: "php",
          },
          {
            name: "Laravel",
            icon: "laravel",
          },
          {
            name: "Node js",
            icon: "nodejs",
          },
          {
            name: "NestJS",
            icon: "nestjs",
          },
          {
            name: "Express",
            icon: "express",
          },
          {
            name: "TypeScript",
            icon: "typescript",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/skills/symfony.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/skills/nodejs.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Cloud/Dev-ops",
        description: (
          <>Building Infrastructure and devops for you</>
        ),
        tags: [
          {
            name: "Docker",
            icon: "docker",
          },
          {
            name: "Docker Swarm",
            icon: "docker",
          },
          {
            name: "Grafana",
            icon: "grafana",
          },
          {
            name: "AWS",
            icon: "aws",
          },
          {
            name: "Github Actions",
            icon: "githubactions",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/skills/docker.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Frontend",
        description: (
            <>Building next gen apps with Next.js + Once UI + Supabase.</>
        ),
        tags: [
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "React Native",
            icon: "reactnative",
          },
          {
            name: "Typescript",
            icon: "typescript",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/skills/nextjs.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/skills/react-native.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Personal Projects – ${person.name}`,
  description: `Dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
