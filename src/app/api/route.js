// pages/api/users.js
import { NextResponse } from "next/server";


export async function GET(){
    return NextResponse.json("Hello World!");
  }
  
  export async function POST(){
    return NextResponse.json({ message: 'Hello World! post' });
  }
  

  