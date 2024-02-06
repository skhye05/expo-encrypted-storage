export type WorkCallback = () => void;

export interface ButtonWorkerProps {
    title?: string;
    children?: React.ReactNode;
    onPress?: (done: WorkCallback) => void;
}