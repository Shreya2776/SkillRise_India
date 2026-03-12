import { Request, Response } from "express";
import pdf from "pdf-parse";

export const uploadResume = async (req: Request, res: Response) => {
    try {

        const file = (req as any).file;

        if (!file) {
            return res.status(400).json({
                message: "No resume uploaded"
            });
        }

        const data = await pdf(file.buffer);

        const resumeText = data.text;

        return res.status(200).json({
            message: "Resume parsed successfully",
            text: resumeText.substring(0, 500) // preview first 500 chars
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error parsing resume",
            error
        });
    }
};