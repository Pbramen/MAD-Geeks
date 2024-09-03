// import React from 'react'
// // DO NOT USE THIS WITH USER-INPUT AS PARAMETERS!!!!

// // contains information for building the HTML tag or Custom Component
// export interface HTMLType<T extends React.ElementType>{
//     tag: T;
//     id: string;
//     title: string;
//     onChange?: ((e: React.ChangeEvent<any>) => void) | (() => void)
//     attributes?: React.ComponentProps<T>, 
//     children?: React.ReactNode
// }

// // grid layout information for css dynamic building.
// export interface FormGridLayout<T extends React.ElementType>{
//     dimensions: number[],
//     arr: HTMLType<T>[]
// }

// // forwardRef<type of the Ref, Parameter_Type>( (args): args_type )
// export const FormatGrid = 
//     ({ dimensions, arr }: FormGridLayout<React.ElementType>) => { 
//         return (
//             <div style={{
//                 'display': "grid",
//                 'padding': '20px',
//                 'rowGap': '15px',
//                 'columnGap': '15px',
//                 'gridTemplateColumns': `repeat(${dimensions[0]}, auto)`,
//                 'gridTemplateRows': `repeat(${dimensions[1]}, auto)`
//         }}>    
//             {arr.map((el, index) => {
//                 return (
//                     <div key={index} className={"flex flex-column"}>
//                         <label htmlFor={el.id}>{el.title}</label>
//                         {React.createElement(el.tag, {
//                             ...el.attributes,
//                             id: el.id,
//                             onChange: el.onChange,
//                             children: el.children,
//                         })}
//                     </div>
//                 )            
//                 })}
//             </div>
//         )
//     }

