export interface IElectronAPI {
    openFile: () => Promise<void>,
    makePDF: (client) => Promise<void>
}
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}