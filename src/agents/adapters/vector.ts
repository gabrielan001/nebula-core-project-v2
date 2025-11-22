import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { readFile } from 'fs/promises';
import path from 'path';

type FileChunk = {
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
};

export class VectorStore {
  private store: MemoryVectorStore;
  private embeddings: OpenAIEmbeddings;
  private splitter: RecursiveCharacterTextSplitter;
  private static instance: VectorStore;

  private constructor(apiKey: string) {
    this.embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    this.store = new MemoryVectorStore(this.embeddings);
  }

  public static getInstance(apiKey: string): VectorStore {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore(apiKey);
    }
    return VectorStore.instance;
  }

  public async indexFile(filePath: string, content: string): Promise<void> {
    try {
      // Split content into chunks
      const chunks = await this.splitter.splitText(content);
      
      // Create documents with metadata
      const documents = chunks.map((chunk, i) => ({
        pageContent: chunk,
        metadata: {
          source: filePath,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      }));

      // Add to vector store
      await this.store.addDocuments(documents);
    } catch (error) {
      console.error(`Error indexing file ${filePath}:`, error);
      throw error;
    }
  }

  public async indexDirectory(directoryPath: string, fileExtensions: string[] = ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']): Promise<void> {
    // This is a simplified version - in a real implementation, you'd want to walk the directory
    // and process each file with the specified extensions
    console.warn('Directory indexing not fully implemented. Use indexFile for individual files.');
  }

  public async search(query: string, k: number = 5): Promise<FileChunk[]> {
    try {
      const results = await this.store.similaritySearch(query, k);
      return results.map(doc => ({
        content: doc.pageContent,
        metadata: {
          source: doc.metadata.source,
          chunkIndex: doc.metadata.chunkIndex,
          totalChunks: doc.metadata.totalChunks,
        },
      }));
    } catch (error) {
      console.error('Error performing vector search:', error);
      return [];
    }
  }

  public async clear(): Promise<void> {
    // In a real implementation, you'd clear the vector store
    console.warn('Clear operation not implemented for in-memory vector store');
  }
}
