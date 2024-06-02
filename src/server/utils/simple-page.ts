import fs from "fs/promises";
import path from "path";
import { MarginComponent } from "../pages/components/layout/margin-component.js";
import { ImageComponent } from "../pages/components/media/image-component.js";
import { VideoComponent } from "../pages/components/media/video-component.js";
import { BlockquoteComponent } from "../pages/components/text/blockquote-component.js";
import { HeadingComponent } from "../pages/components/text/heading-component.js";
import { LinkTextComponent } from "../pages/components/text/link-text-component.js";
import { MarkdownLoader } from "../pages/components/text/markdown-loader.js";
import { PlainTextComponent } from "../pages/components/text/plain-text-component.js";
import { StyledTextComponent } from "../pages/components/text/styled-text-component.js";
import { GeneratedPage } from "../pages/generated-page.js";
import { HeaderSection } from "../pages/sections/header-section.js";
import { PaddedSection } from "../pages/sections/padded-section.js";
import { WebpageSection } from "../pages/sections/webpage-section.js";

const fields = {
    resources: 'Resources',
    essay: 'Research Essay',
    video: 'Video Pitch',
    scriptLink: 'Pitch Script',
    artwork: 'Artwork Description',
    creatorStatement: 'Creator Statement'
};

export class SimplePage extends GeneratedPage {
    constructor(private options: Partial<{ artwork: string[] }> = {}) {
        super();
    }

    async generateWebpage(): Promise<string> {
        const resources = this.getResources();

        const header = new HeaderSection();

        this.add(header);

        this.add(new PaddedSection(
            new MarginComponent(),
            ...MarkdownLoader.load(resources.getContent(fields.creatorStatement) || `*Missing overview: Add property '${fields.creatorStatement}' in content.json*`),
            new MarginComponent()
        ));
        
        const pitch = new PaddedSection();

        pitch.add(
            new MarginComponent(),
            new HeadingComponent('Video Pitch'),
            new VideoComponent(resources.getContent(fields.video) || "9xwazD5SyVg"),
            new MarginComponent()
        );

        if (resources.getContent(fields.scriptLink)) {
            pitch.add(
                new BlockquoteComponent(
                    new PlainTextComponent("For more details, see the "),
                    new LinkTextComponent([ new PlainTextComponent("script") ], resources.getContent(fields.scriptLink)),
                    new PlainTextComponent(" used for the video.")
                ),
                new MarginComponent()
            );
        } else {
            pitch.add(
                new BlockquoteComponent(
                    new StyledTextComponent("italic",
                        new PlainTextComponent("No script was provided for the video pitch.")
                    )
                ),
                new MarginComponent()
            );
        }

        const images: ImageComponent[] = [];

        for (const file of this.options.artwork || []) {
            images.push(new ImageComponent('./' + file));
        }

        pitch.add(
            new HeadingComponent('Project Artwork'),
            ...MarkdownLoader.load(resources.getContent(fields.artwork)  || `*Missing artwork description: Add property '${fields.artwork}' in content.json*`),
            new MarginComponent(),
            ...images,
            new MarginComponent()
        );

        pitch.setSectionTheme(WebpageSection.Theme.Dark);

        this.add(pitch);

        const essay = new PaddedSection(
            new HeadingComponent("Research Essay"),
            ...MarkdownLoader.load(resources.getContent(fields.essay) || `*Missing research essay: Add property '${fields.essay}' in content.json*`),
            new MarginComponent()
        );

        this.add(essay);

        const resourcesSection = new PaddedSection(
            new HeadingComponent("Resources"),
            ...MarkdownLoader.load(resources.getContent(fields.resources) || `*Missing resources: Add property '${fields.resources}' in content.json*`),
            new MarginComponent()
        );

        resourcesSection.setSectionTheme(WebpageSection.Theme.AltLight);
      
        this.add(resourcesSection);
        
        return await super.generateWebpage();
    }
}