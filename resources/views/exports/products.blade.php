<h2>Products</h2>

<table width="100%" border="1" cellspacing="0" cellpadding="5">

<thead>

<tr>

<th>SKU</th>

<th>Name</th>

<th>Supplier</th>

<th>Category</th>

<th>Stock</th>

<th>Status</th>

<th>Price</th>

</tr>

</thead>

<tbody>

@foreach($products as $product)

<tr>

<td>{{ $product->sku }}</td>

<td>{{ $product->name }}</td>

<td>{{ $product->supplier }}</td>

<td>{{ $product->category }}</td>

<td>{{ $product->quantity }}</td>

<td>{{ $product->status }}</td>

<td>{{ $product->selling_price }}</td>

</tr>

@endforeach

</tbody>

</table>