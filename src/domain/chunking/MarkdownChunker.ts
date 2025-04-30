import fs from 'node:fs/promises'
import path from 'node:path'
import type { DocumentChunk } from '../../types/types.ts'
import { deterministicChunkId } from './deterministicChunkId'
import type { IChunker } from './IChunker'

const MAX_CHARS = 1800
const OVERLAP = 200

/**
 * Chunker implementation for Markdown files.
 * Splits a Markdown file into chunks based on headings and size constraints.
 */
export class MarkdownChunker implements IChunker {
  /**
   * Split a Markdown file into chunks.
   * @param filePath - Path to the Markdown file
   * @returns Promise resolving to an array of DocumentChunk
   */
  async chunk(filePath: string): Promise<DocumentChunk[]> {
    const lines = await this.getFileLines(filePath)
    const source = path.basename(filePath)
  
    const chunks: DocumentChunk[] = []
    let sections: { heading: string; lines: string[] }[] = []
  
    let current: string[] = []
    let currentHeading = 'Prelude'
  
    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Push previous block
        if (current.length > 0) {
          sections.push({ heading: currentHeading, lines: current })
        }
        currentHeading = line.replace(/^##\s*/, '').trim()
        current = [line]
      } else {
        current.push(line)
      }
    }
  
    if (current.length > 0) {
      sections.push({ heading: currentHeading, lines: current })
    }
  
    let index = 0
    for (const section of sections) {
      const text = section.lines.join('\n')
      chunks.push(...this.splitIntoChunks(text, source, section.heading, index))
      index = chunks.length
    }
  
    return chunks
  }
  

  private async getFileLines(filePath: string): Promise<string[]> {
    const raw = await fs.readFile(filePath, 'utf-8')
    return raw.split('\n')
  }

  private sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') return ''
    return text.trim()
  }

  private createChunk(content: string, source: string, heading: string, index: number): DocumentChunk {
    return {
      id: deterministicChunkId(content, source, heading, index),
      content,
      metadata: {
        source,
        heading,
        index
      }
    }
  }

  private splitIntoChunks(text: string, source: string, heading: string, startIndex: number): DocumentChunk[] {
    const clean = this.sanitizeText(text)
    if (!clean) return []
    if (clean.length <= MAX_CHARS) {
      return [this.createChunk(clean, source, heading, startIndex)]
    }
    const chunks: DocumentChunk[] = []
    let index = startIndex
    let pos = 0
    while (pos < clean.length) {
      const chunkText = clean.slice(pos, pos + MAX_CHARS)
      chunks.push(this.createChunk(chunkText, source, heading, index++))
      pos += MAX_CHARS - OVERLAP
    }
    return chunks
  }
} 