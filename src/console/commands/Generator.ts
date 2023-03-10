import { Generation } from '../../interfaces/Generation';
import { Filesystem } from '../../libraries/Filesystem';

export abstract class Generator implements Generation
{ 
  public options: unknown;
  
  public content: string | null = null;

  public className: string;

  private fs: Filesystem = new Filesystem;
  
  constructor(className: string, options: unknown) {    
    this.className = className;
    this.options = options;
  }

  async stub(dialect: string, stub: string): Promise<string> {
    this.content = await this.fs.stub(dialect, stub);
    
    return this.content;
  }

  async save(type: string, content: string): Promise<string> {
    this.content = content ? content : this.content;

    if (!this.content) {
      throw new Error('No content');
    }

    await this.fs.save(type, content, this.className);

    return this.content;
  }

  replaceToken(content: string, find: string, replace: string) {
    return content.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  escapeRegExp(content: string) {
    return content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
 
  clearContent(): void {
    this.content = null;
  }
}