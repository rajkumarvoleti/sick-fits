import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells appolo we will take care of everything
    read(exsisting = [], { args, cache }) {
      // console.log(exsisting, args, cache);
      const { skip, first } = args;
      // read the number of items on the page from the cache
      // console.log(`first is ${first}`);
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first - 1;
      const pages = Math.ceil(count / first);

      // check if exsisiting
      const items = exsisting.slice(skip, skip + first).filter((x) => x);

      // if there are items and not enough items to how many we requested
      // and we are on the last page then =>
      // console.log(items);
      if (items.length && items.length !== first) {
        return items;
      }
      if (items.length !== first) {
        // we don't have any items, wemust go to the network to fetch them
        return false;
      }
      // if there are items the we return it and don;t need to go to the network
      if (items.length) {
        // console.log(
        // `there are ${items.length} items inn the cache! Gonna send them to appolo`
        // );
        return items;
      }

      return false;
      // first thing it does is it asks read function tfor thode items

      // We can either do one of the two things

      // First thing we can do is return the items because they are already in the cache

      // The other thing we can do is to return false from here, (network request)
    },

    merge(exsisting, incoming, { args }) {
      // this runs when the appolo client comes back from the netwirk with our product
      const { skip, first } = args;
      // console.log(`merging the items from the network ${incoming.length}`);
      const merged = exsisting ? exsisting.slice(0) : [];
      // eslint-disable-next-line no-plusplus
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log(merged);
      // Finally we return the merged items from the cache,
      return merged;
    },
  };
}
