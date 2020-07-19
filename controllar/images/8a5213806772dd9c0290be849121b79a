function maxHeap(arr, i){
    var left = 2*i+1;
    var right = 2*i+2;
    var max = i;

    if(left<arrLength && arr[left]>arr[max]){
        max = left
    }
    if(right<arrLength && arr[right]>arr[max]){
        max = right
    }
    if(max != i){
        swap(arr,i,max)
        maxHeap(arr,max)
    }
}
// function for swaping
function swap(arr, firstIndex,secondIndex){
    var temp = arr[firstIndex]
    arr[firstIndex]=arr[secondIndex]
    arr[secondIndex]=temp
}

function heapsort(arr){
    arrLength = arr.length;
    for(var i = Math.floor(arrLength/2); i>=0; i -=1){
        maxHeap(arr, i)
    }

    for(i = arr.length-1; i>0; i--){
        swap(arr,0,i)
        arrLength--
        maxHeap(arr, 0)
    }
    return arr;
}
var arrLength;
console.log(heapsort([1,4,2,3,5,-1]));