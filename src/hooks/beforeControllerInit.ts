export interface IBeforeControllerInit {
	beforeControllerInit(): Promise<void> | void;
}