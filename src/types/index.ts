export type ProjectType = 'FORM' | 'LANDING_PAGE';

export interface Project {
    id: string;
    workspace_id: string;
    name: string;
    description?: string;
    slug: string;
    content: any[]; // Using any[] for now as content structure varies
    is_published: boolean;
    type: ProjectType;
    settings: Record<string, any>;
    visits?: number;
    submissions?: number;
    created_at: string;
    updated_at: string;
    leads?: { count: number }[];
}

export interface LandingPage {
    id: string;
    created_at: string;
    name: string;
    slug: string;
    workspace_id: string;
    content: any[]; // specific LPElement[] type can be used in frontend
    is_published: boolean;
    settings: any;
}
