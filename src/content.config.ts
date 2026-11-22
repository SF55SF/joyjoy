import { defineCollection, z } from 'astro:content';
import {validateProperty} from '../public/js/joyjoy-investment-model.js';

const properties = defineCollection({type:'data',schema:z.object({slug:z.string()}).passthrough().superRefine((data,ctx)=>{for(const field of validateProperty(data))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Invalid property: '+field});})});
export const collections = { properties };
