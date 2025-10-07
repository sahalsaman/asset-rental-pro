import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json("web hook Hello World!");
  }
  
export async function POST(){
    return NextResponse.json({ message: 'web hook Hello World! post' });
  }
  