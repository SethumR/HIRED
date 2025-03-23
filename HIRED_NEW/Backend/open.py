import openai

openai.api_key = "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"

try:
    # Correct API endpoint for chat models
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello, OpenAI!"}
        ],
        max_tokens=10
    )
    print(response)
except Exception as e:
    print(f"OpenAI API error: {str(e)}")