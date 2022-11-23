import { RouterProps } from "preact-router";


interface Props extends RouterProps{
	type : string
}

export const Error = ({ type, url }: Props) => (
	<section class="error">
		<h2>Error {type}</h2>
		<p>It looks like we hit a snag.</p>
		<pre>{url}</pre>
	</section>
);