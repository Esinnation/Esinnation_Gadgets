import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '9c70o0ja',
  dataset:'production',
  apiVersion:'2023-07-03',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});


const builder=imageUrlBuilder(client);
export const urlFor=(source)=>{
  return builder.image(source);
}
