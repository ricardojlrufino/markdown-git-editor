export const Error = ({ type, url }) => (
	<section class="error">
		<h2>Error {type}</h2>
		<p>It looks like we hit a snag.</p>
		<pre>{url}</pre>
	</section>
);