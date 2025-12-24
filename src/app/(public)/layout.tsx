import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";

import classNames from "classnames";

import { baseURL, fonts, style, dataStyle, home, effects } from "@/resources";
import {
  Background,
  Column,
  Flex,
  opacity,
  RevealFx,
  SpacingToken,
} from "@once-ui-system/core";
import { Footer, Header, Providers, RouteGuard } from "@/components";

export async function generateMetadata() {
  return {
    title: home.title,
    description: home.description,
    metadataBase: new URL(`https://${baseURL}`),
  };
}

export default function PublicRootLayout({
                                           children,
                                         }: {
  children: React.ReactNode;
}) {
  return (
      <html
          lang="en"
          suppressHydrationWarning
          className={classNames(
              fonts.heading.variable,
              fonts.body.variable,
              fonts.label.variable,
              fonts.code.variable,
          )}
      >
      <head>
        <script
            id="theme-init"
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                try {
                  const root = document.documentElement;

                  const config = ${JSON.stringify({
                brand: style.brand,
                accent: style.accent,
                neutral: style.neutral,
                solid: style.solid,
                "solid-style": style.solidStyle,
                border: style.border,
                surface: style.surface,
                transition: style.transition,
                scaling: style.scaling,
                "viz-style": dataStyle.variant,
              })};

                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });

                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };

                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);

                  Object.keys(config).forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) root.setAttribute('data-' + key, value);
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
            }}
        />
      </head>

      <body style={{ margin: 0, padding: 0 }}>
      <Providers>
        <Column
            fillWidth
            background="page"
            style={{ minHeight: "100vh" }}
            horizontal="center"
        >
          <RevealFx fill position="absolute">
            <Background
                mask={{
                  x: effects.mask.x,
                  y: effects.mask.y,
                  radius: effects.mask.radius,
                  cursor: effects.mask.cursor,
                }}
                gradient={{
                  display: effects.gradient.display,
                  opacity: effects.gradient.opacity as opacity,
                  x: effects.gradient.x,
                  y: effects.gradient.y,
                  width: effects.gradient.width,
                  height: effects.gradient.height,
                  tilt: effects.gradient.tilt,
                  colorStart: effects.gradient.colorStart,
                  colorEnd: effects.gradient.colorEnd,
                }}
                dots={{
                  display: effects.dots.display,
                  opacity: effects.dots.opacity as opacity,
                  size: effects.dots.size as SpacingToken,
                  color: effects.dots.color,
                }}
                grid={{
                  display: effects.grid.display,
                  opacity: effects.grid.opacity as opacity,
                  color: effects.grid.color,
                  width: effects.grid.width,
                  height: effects.grid.height,
                }}
                lines={{
                  display: effects.lines.display,
                  opacity: effects.lines.opacity as opacity,
                  size: effects.lines.size as SpacingToken,
                  thickness: effects.lines.thickness,
                  angle: effects.lines.angle,
                  color: effects.lines.color,
                }}
            />
          </RevealFx>

          <Flex fillWidth minHeight="16" s={{ hide: true }} />
          <Header />

          <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
            <Flex horizontal="center" fillWidth minHeight="0">
              <RouteGuard>{children}</RouteGuard>
            </Flex>
          </Flex>

          <Footer />
        </Column>
      </Providers>
      </body>
      </html>
  );
}
