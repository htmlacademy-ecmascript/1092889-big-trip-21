import {Point} from '../contracts/contracts';


export default abstract class AbstractPresenter {
	abstract get id(): Point['id']

	protected abstract render(): void

	abstract remove(): void
}
