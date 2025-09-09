// import React from 'react'

// const FilterSections = () => {
    
//   return <div>{filteredAndSortedExpenses.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">💸</div>
//               <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
//               <p className="text-muted-foreground">
//                 {expenses.length === 0 
//                   ? "Start tracking your expenses by adding your first transaction."
//                   : "No expenses match your current filters. Try adjusting your search."
//                 }
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {filteredAndSortedExpenses.map((expense) => (
//                 <div
//                   key={expense.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                 >
//                   <div className="flex items-center gap-4 flex-1">
//                     <div className={`p-2 rounded-full ${getCategoryColor(expense.category)} text-white`}>
//                       <span className="text-lg">{getCategoryIcon(expense.category)}</span>
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <h4 className="font-semibold truncate">{expense.title}</h4>
//                         <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
//                           {expense.category}
//                         </span>
//                       </div>
//                       {expense.description && (
//                         <p className="text-sm text-muted-foreground truncate">{expense.description}</p>
//                       )}
//                       <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <div className="text-right mr-4">
//                       <div className="font-bold text-lg">{formatAmount(expense.amount)}</div>
//                     </div>
                    
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => onEdit(expense)}
//                       className="hover:bg-blue-50 hover:text-blue-600"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
                    
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => onDelete(expense.id)}
//                       className="hover:bg-red-50 hover:text-red-600"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}</div>;
// }

// export default FilterSections