export type Note = {
    note_id: number;
    user_id: number;
    title: string;
    content: string;
    status: "active" | "archived";
    createdAt: Date;
    updatedAt: Date;
};