const c = {
    Kaomoji: class{
        constructor(value, emotions){
            this.value = value;
            this.emotions = emotions;
        }
        isEmoticon(s){
            return this.emotions.includes(s);
        }
    }
}
module.exports = c;