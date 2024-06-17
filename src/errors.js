
class Errors {

    static wrongNewDate() {
        console.log("ERROR: The new date is not in the future!");
    }

    static emptyArray() {
        console.log("ERROR: ArrayList is empty")
    }

    static unexpectedParam() {
        console.log("ERROR: Unknown parameter sent");
    }
}

export { Errors }