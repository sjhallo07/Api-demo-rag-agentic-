import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface ChunkedDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

/**
 * Service to handle document parsing and chunking using LangChain splitters.
 */
export class DocumentProcessor {
  private splitter: RecursiveCharacterTextSplitter;

  constructor(chunkSize = 1000, chunkOverlap = 200) {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
  }

  /**
   * Splits a large text document into smaller semantic chunks.
   * Useful for preparing documents for Vector embeddings.
   */
  async processText(text: string, sourceName: string): Promise<ChunkedDocument[]> {
    const chunks = await this.splitter.createDocuments([text]);
    
    return chunks.map((chunk, index) => ({
      id: `${sourceName}_chunk_${index}`,
      content: chunk.pageContent,
      metadata: {
        source: sourceName,
        chunkIndex: index,
        ...chunk.metadata
      }
    }));
  }

  /**
   * Extract and chunk text from a base64 encoded document (like those from chat attachments).
   */
  async processBase64Document(base64Data: string, filename: string): Promise<ChunkedDocument[]> {
    try {
      // In a real implementation, you would use pdf-parse or mammoth to extract text
      // For this client-side demo, we assume the base64 can be decoded to text if it's plain text, 
      // or we extract simulated text for demo purposes.
      let textContent = "";
      
      if (base64Data.startsWith('data:text/plain')) {
        textContent = atob(base64Data.split(',')[1]);
      } else {
        textContent = `[Simulated text extraction from ${filename}]\n` +
          `This document discusses various financial factors including momentum, value, and quality.\n` +
          `It contains several sections regarding sector rotation and macro indicators.`;
      }

      return this.processText(textContent, filename);
    } catch (error) {
      console.error("Error processing document:", error);
      return [];
    }
  }
}

export const documentProcessor = new DocumentProcessor();
